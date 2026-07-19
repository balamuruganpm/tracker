import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Award, ArrowRight } from 'lucide-react'

export default async function CoursesPage() {
  const supabase = await createClient()

  // Fetch all active courses
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'Active')
    .order('order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Learning Roadmap</h1>
        <p className="text-neutral-500 mt-1">Track your progress from beginner to professional level.</p>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
          <BookOpen className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-bold text-neutral-800">No Active Courses</h3>
          <p className="text-neutral-500 text-sm mt-1">Curriculum outlines will appear once seeded in Phase 3.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const courseColor = course.color || 'blue'
            return (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-300"
              >
                <div>
                  {/* Top indicators */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-lg bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-500">
                      {course.difficulty}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">
                      {course.estimated_hours}h estimated
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                    {course.description || 'Dive into this comprehensive path.'}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="mt-6 pt-4 border-t border-neutral-50">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
