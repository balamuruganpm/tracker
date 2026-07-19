import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LessonClientView from './LessonClientView'

interface PageProps {
  params: Promise<{ lessonSlug: string }>
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonSlug } = await params
  const supabase = await createClient()

  // 1. Fetch current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 2. Fetch lesson
  const { data: lesson, error: lessonErr } = await supabase
    .from('lessons')
    .select('*, chapter:chapters(id, title, module:modules(id, title, course:courses(id, title, slug)))')
    .eq('slug', lessonSlug)
    .single()

  if (lessonErr || !lesson) {
    notFound()
  }

  // 3. Fetch resources
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('sort_order', { ascending: true })

  // 4. Fetch tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('lesson_id', lesson.id)

  // 5. Fetch user progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('lesson_id', lesson.id)
    .eq('user_id', user.id)
    .single()

  // 6. Fetch existing notes
  const { data: notes } = await supabase
    .from('lesson_notes')
    .select('*')
    .eq('lesson_id', lesson.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto">
      <LessonClientView
        lesson={lesson}
        resources={resources || []}
        tasks={tasks || []}
        initialProgress={progress}
        initialNotes={notes || []}
        userId={user.id}
      />
    </div>
  )
}
