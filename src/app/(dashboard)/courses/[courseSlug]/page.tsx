import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChevronRight, Play, BookOpen, Compass, CheckCircle, FileText } from 'lucide-react'

interface PageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = await params
  const supabase = await createClient()

  // 1. Fetch authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single()

  if (courseErr || !course) {
    notFound()
  }

  // 3. Fetch modules, chapters, and lessons
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', course.id)
    .order('order', { ascending: true })

  const moduleIds = modules?.map((m) => m.id) || []

  const { data: chapters } = moduleIds.length
    ? await supabase
        .from('chapters')
        .select('*')
        .in('module_id', moduleIds)
        .order('order', { ascending: true })
    : { data: [] }

  const chapterIds = chapters?.map((c) => c.id) || []

  const { data: lessons } = chapterIds.length
    ? await supabase
        .from('lessons')
        .select('*')
        .in('chapter_id', chapterIds)
        .order('order', { ascending: true })
    : { data: [] }

  // Fetch user completed progress
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('status', 'Completed')

  const completedLessonIds = new Set(userProgress?.map(p => p.lesson_id) || [])
  const firstUncompletedId = lessons?.find(l => !completedLessonIds.has(l.id))?.id

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 pb-12">
      
      {/* Header back navigation */}
      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Link href="/courses" className="hover:text-blue-600">Learning</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Curriculum Outline</span>
      </div>

      {/* Professional course header */}
      <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm space-y-4">
        <div>
          <span className="inline-flex items-center rounded-lg bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wide border border-slate-100">
            {course.difficulty}
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{course.title}</h1>
          <p className="mt-1.5 text-xs text-slate-500 max-w-2xl font-medium">{course.description}</p>
        </div>

        <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>{course.estimated_hours} Hours Estimated</span>
          <span>&bull;</span>
          <span>{lessons?.length || 0} Lessons Total</span>
        </div>
      </div>

      {/* Modules list */}
      <div className="space-y-6">
        {!modules || modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Compass className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-800">No Modules Loaded</h3>
            <p className="text-slate-500 text-sm mt-1">This course roadmap outline is currently empty.</p>
          </div>
        ) : (
          modules.map((mod, modIdx) => {
            const modChapters = chapters?.filter((c) => c.module_id === mod.id) || []
            const modLessons = lessons?.filter(l => modChapters.some(c => c.id === l.chapter_id)) || []
            const modCompletedCount = modLessons.filter(l => completedLessonIds.has(l.id)).length

            return (
              <div key={mod.id} className="space-y-3">
                
                {/* Module Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Module {String(modIdx + 1).padStart(2, '0')}</span>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">{mod.title.replace(/^Module \d+\s*[–-]?\s*/i, '')}</h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {modLessons.length} Lessons &bull; {modCompletedCount} Completed
                  </span>
                </div>

                {/* Chapters inside module */}
                <div className="space-y-4">
                  {modChapters.map((chap) => {
                    const chapLessons = lessons?.filter((l) => l.chapter_id === chap.id) || []
                    return (
                      <div key={chap.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
                        <div className="border-b border-slate-50 pb-1.5">
                          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wide">{chap.title}</h3>
                        </div>

                        {/* Lessons List under chapter */}
                        <div className="divide-y divide-slate-50">
                          {chapLessons.map((lesson) => {
                            const isCompleted = completedLessonIds.has(lesson.id)
                            return (
                              <div key={lesson.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                  {isCompleted ? (
                                    <CheckCircle className="h-4.5 w-4.5 text-green-500 fill-current bg-white" />
                                  ) : lesson.id === firstUncompletedId ? (
                                    <Play className="h-4.5 w-4.5 text-blue-500 fill-current bg-white animate-pulse" />
                                  ) : (
                                    <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-200" />
                                  )}
                                  <Link
                                    href={`/lessons/${lesson.slug}`}
                                    className={`text-xs font-semibold hover:text-blue-600 transition-colors ${
                                      isCompleted ? 'text-slate-400 line-through font-medium' : 'text-slate-700'
                                    }`}
                                  >
                                    {lesson.title}
                                  </Link>
                                </div>
                                <div className="flex items-center space-x-2.5">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lesson.estimated_minutes || 45} mins</span>
                                  <Link
                                    href={`/lessons/${lesson.slug}`}
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-50 p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                  >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                  </Link>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
