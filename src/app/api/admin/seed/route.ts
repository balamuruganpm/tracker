import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedCurriculum } from '@/lib/supabase/seed-data'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Forbidden', { status: 403 })
  }

  const supabase = await createClient()

  // Verify Admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single()

  const userRole = (profile?.roles as any)?.name || 'Viewer'
  if (userRole !== 'Admin') {
    return NextResponse.json({ error: 'Access denied: Admin only' }, { status: 403 })
  }

  try {
    // 1. Delete existing courses (cascades to modules, chapters, lessons, tasks, resources)
    const { error: clearErr } = await supabase
      .from('courses')
      .delete()
      .neq('title', '') // deletes all

    if (clearErr) throw clearErr

    // 2. Loop and insert new structures
    for (let cIdx = 0; cIdx < seedCurriculum.length; cIdx++) {
      const seedCourse = seedCurriculum[cIdx]
      const { data: course, error: cErr } = await supabase
        .from('courses')
        .insert({
          title: seedCourse.title,
          slug: seedCourse.slug,
          description: seedCourse.description,
          difficulty: seedCourse.difficulty,
          estimated_hours: seedCourse.estimated_hours,
          icon: seedCourse.icon,
          color: seedCourse.color,
          status: 'Active',
          order: cIdx
        })
        .select()
        .single()

      if (cErr) throw cErr

      for (let mIdx = 0; mIdx < seedCourse.modules.length; mIdx++) {
        const seedModule = seedCourse.modules[mIdx]
        const { data: mod, error: mErr } = await supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: seedModule.title,
            description: seedModule.description,
            order: mIdx
          })
          .select()
          .single()

        if (mErr) throw mErr

        for (let chIdx = 0; chIdx < seedModule.chapters.length; chIdx++) {
          const seedChapter = seedModule.chapters[chIdx]
          const { data: chap, error: chErr } = await supabase
            .from('chapters')
            .insert({
              module_id: mod.id,
              title: seedChapter.title,
              description: seedChapter.description,
              order: chIdx
            })
            .select()
            .single()

          if (chErr) throw chErr

          for (let lIdx = 0; lIdx < seedChapter.lessons.length; lIdx++) {
            const seedLesson = seedChapter.lessons[lIdx]
            const { data: les, error: lErr } = await supabase
              .from('lessons')
              .insert({
                chapter_id: chap.id,
                title: seedLesson.title,
                slug: seedLesson.slug,
                description: seedLesson.description,
                estimated_minutes: seedLesson.estimated_minutes,
                difficulty: seedLesson.difficulty,
                learning_objectives: seedLesson.learning_objectives,
                prerequisites: seedLesson.prerequisites,
                completed: false,
                order: lIdx
              })
              .select()
              .single()

            if (lErr) throw lErr

            for (let tIdx = 0; tIdx < seedLesson.tasks.length; tIdx++) {
              const seedTask = seedLesson.tasks[tIdx]
              const { error: tErr } = await supabase
                .from('tasks')
                .insert({
                  lesson_id: les.id,
                  title: seedTask.title,
                  description: seedTask.description || '',
                  task_type: seedTask.task_type,
                  upload: seedTask.upload,
                  estimated_minutes: seedTask.estimated_minutes
                })

              if (tErr) throw tErr
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Seeding failed' }, { status: 500 })
  }
}
