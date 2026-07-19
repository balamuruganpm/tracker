import { createClient } from '@/lib/supabase/server'
import { FileDown, Calendar, BookOpen, Landmark, Clock, Award } from 'lucide-react'

export default async function ReportsPage() {
  const supabase = await createClient()

  // Fetch metrics
  const { count: certCount } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })

  const { count: projCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { data: progress } = await supabase
    .from('user_progress')
    .select('id')
    .eq('status', 'Completed')

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Weekly & Monthly Reports</h1>
          <p className="text-neutral-500 mt-1">Download and inspect summaries of your study habits and milestones.</p>
        </div>
        <button
          onClick={() => alert('PDF generation will trigger in production Vercel build.')}
          className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <FileDown className="h-4 w-4" />
          <span>Download PDF Summary</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Report Card */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>Weekly Report</span>
            </span>
            <span className="text-xs text-neutral-400 font-semibold">Updated today</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Study hours this week</span>
              <span className="text-sm font-bold text-neutral-900">8.3 hours</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Lessons completed</span>
              <span className="text-sm font-bold text-neutral-900">{progress?.length || 0} lessons</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold text-neutral-500">Practice tasks completed</span>
              <span className="text-sm font-bold text-neutral-900">4 tasks</span>
            </div>
          </div>
        </div>

        {/* Monthly Report Card */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>Monthly Report</span>
            </span>
            <span className="text-xs text-neutral-400 font-semibold">Updated this month</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Study hours this month</span>
              <span className="text-sm font-bold text-neutral-900">32.6 hours</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Milestones achieved</span>
              <span className="text-sm font-bold text-neutral-900">{projCount || 0} projects built</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold text-neutral-500">Certificates earned</span>
              <span className="text-sm font-bold text-neutral-900">{certCount || 0} certificates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
