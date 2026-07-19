import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChevronRight, Play, BookOpen, Compass, CheckCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = await params
  const supabase = await createClient()

  // 1. Fetch course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single()

  if (courseErr || !course) {
    notFound()
  }

  // 2. Fetch modules, chapters, and lessons
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

  return (
    <div className="space-y-10">
      {/* Header Back Banner */}
      <div className="rounded-2xl bg-white border border-neutral-100 p-8 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
          <Link href="/courses" className="hover:underline">Roadmap</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Curriculum</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mt-1">{course.title}</h1>
        <p className="mt-2 text-neutral-500 max-w-2xl">{course.description}</p>
      </div>

      {/* Modules Roadmap Grid */}
      <div className="space-y-8 max-w-4xl">
        {!modules || modules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
            <Compass className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-bold text-neutral-800">No Chapters or Modules Loaded</h3>
            <p className="text-neutral-500 text-sm mt-1">This course roadmap is empty. Head to the curriculum editor to add them.</p>
          </div>
        ) : (
          modules.map((mod, modIdx) => {
            const modChapters = chapters?.filter((c) => c.module_id === mod.id) || []
            return (
              <div key={mod.id} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                    {modIdx + 1}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{mod.title}</h2>
                    {mod.description && <p className="text-neutral-500 text-sm">{mod.description}</p>}
                  </div>
                </div>

                <div className="ml-11 space-y-6">
                  {modChapters.map((chap) => {
                    const chapLessons = lessons?.filter((l) => l.chapter_id === chap.id) || []
                    return (
                      <div key={chap.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="font-bold text-neutral-800 text-base">{chap.title}</h3>
                        {chap.description && <p className="text-neutral-500 text-xs">{chap.description}</p>}

                        <div className="divide-y divide-neutral-50">
                          {chapLessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                              <div className="flex items-center space-x-3">
                                <BookOpen className="h-4 w-4 text-neutral-400" />
                                <Link
                                  href={`/lessons/${lesson.slug}`}
                                  className="text-sm font-semibold text-neutral-700 hover:text-blue-600 transition-colors"
                                >
                                  {lesson.title}
                                </Link>
                              </div>
                              <Link
                                href={`/lessons/${lesson.slug}`}
                                className="inline-flex items-center justify-center rounded-lg bg-neutral-50 p-2 text-neutral-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                              >
                                <Play className="h-4 w-4 fill-current" />
                              </Link>
                            </div>
                          ))}
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
