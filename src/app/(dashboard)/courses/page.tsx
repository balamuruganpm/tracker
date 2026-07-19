import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Award, ArrowRight, Zap, Play, CheckCircle } from 'lucide-react'

export default async function CoursesPage() {
  const supabase = await createClient()

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all active courses
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'Active')
    .order('order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  // Fetch all lessons with course details
  const { data: allLessons } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      slug,
      chapter:chapters (
        id,
        title,
        module:modules (
          id,
          course_id
        )
      )
    `)

  // Fetch all completed progress for user
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('status', 'Completed')

  const completedLessonIds = new Set(userProgress?.map(p => p.lesson_id) || [])

  // Calculate JS course specific details for the Hero banner
  const jsCourse = courses?.find(c => c.slug === 'javascript')
  const jsLessons = allLessons?.filter(l => ((l as any).chapter?.module?.course_id === jsCourse?.id)) || []
  const jsTotal = jsLessons.length
  const jsCompleted = jsLessons.filter(l => completedLessonIds.has(l.id)).length
  const jsPercent = jsTotal ? Math.round((jsCompleted / jsTotal) * 100) : 0

  // Query last study session
  const { data: lastSession } = await supabase
    .from('study_sessions')
    .select('lesson_id, lessons(title, slug, chapter_id)')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('ended_at', { ascending: false })
    .limit(1)
    .maybeSingle() as any

  // Find next suggested lesson
  const nextSuggested = jsLessons.find(l => !completedLessonIds.has(l.id))
  
  const { data: nextLessonDetails } = nextSuggested
    ? await supabase
        .from('lessons')
        .select('title, slug')
        .eq('id', nextSuggested.id)
        .single()
    : { data: null }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 pb-12">
      
      {/* Professional Learning Header */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span>Learning Workspace</span>
        </h1>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Your professional curriculum path and roadmaps</p>
      </div>

      {/* Hero Section - Professional Platform Style */}
      <div className="rounded-2xl border border-slate-100 bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0 shadow-sm">
        <div className="space-y-4 md:w-3/5">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">Featured Course</span>
          <h2 className="text-2xl font-bold tracking-tight">JavaScript Master Course</h2>
          <p className="text-xs text-slate-400 font-medium max-w-md">Go from absolute zero to advanced mastery. Powering frontends, SPFx, and Node.js backend pipelines.</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Course Progress</span>
              <span className="font-mono font-bold text-white">{jsPercent}% ({jsCompleted} / {jsTotal} Lessons)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden border border-white/5">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${jsPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="md:w-2/5 flex md:justify-end">
          <Link
            href="/courses/javascript"
            className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all active:scale-[0.98]"
          >
            <span>Continue Learning</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Recently Studied widget block */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Recently Studied</span>
          </h3>
          {lastSession ? (
            <div className="flex items-start justify-between border border-slate-50 p-3 rounded-xl bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">{lastSession.lessons?.title}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Last active study session</p>
              </div>
              <span className="rounded-lg bg-green-50 border border-green-100 px-2 py-0.5 text-[9px] font-bold text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-medium italic p-3 border border-slate-50 rounded-xl bg-slate-50/50">
              No recently studied lessons yet. Start study below!
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Play className="h-4 w-4 text-blue-600" />
            <span>Next Suggested Lesson</span>
          </h3>
          {nextLessonDetails ? (
            <div className="flex items-start justify-between border border-slate-50 p-3 rounded-xl bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-800">{nextLessonDetails.title}</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Resume your learning roadmap</p>
              </div>
              <Link 
                href={`/lessons/${nextLessonDetails.slug}`}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-3 py-1 flex items-center gap-1"
              >
                <span>Resume</span>
              </Link>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-medium italic p-3 border border-slate-50 rounded-xl bg-slate-50/50">
              You completed all lessons in the path! 🎉
            </div>
          )}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">All Curriculum Paths</h3>
        
        {!courses || courses.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold text-xs border border-dashed border-slate-100 rounded-2xl bg-white">
            No courses available yet. Seed the curriculum to populate.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const courseLessons = allLessons?.filter(l => ((l as any).chapter?.module?.course_id === course.id)) || []
              const totalCount = courseLessons.length
              const completedCount = courseLessons.filter(l => completedLessonIds.has(l.id)).length
              const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

              return (
                <div
                  key={course.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Top indicators */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-lg bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wide border border-slate-100">
                        {course.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {course.estimated_hours} Hours
                      </span>
                    </div>

                    {/* Course Title */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 font-semibold line-clamp-2">
                        {course.description || 'Dive into this comprehensive path.'}
                      </p>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom link */}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lessons: {totalCount}</span>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
