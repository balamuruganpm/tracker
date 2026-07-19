import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BarChart2, TrendingUp, Calendar, Zap, PieChart } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all completed study sessions
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes, started_at, course_name, lesson_name')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('started_at', { ascending: false })

  const totalMin = sessions?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0
  const totalHours = (totalMin / 60).toFixed(1)
  const averageSessionMin = sessions && sessions.length > 0 
    ? Math.round(totalMin / sessions.length) 
    : 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-blue-600" />
          <span>Analytics Overview</span>
        </h1>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Understand your learning velocity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400">
            <Zap className="h-4.5 w-4.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Total Study Time</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">{totalHours} hrs</h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Logged across all time</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400">
            <TrendingUp className="h-4.5 w-4.5 text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-wider">Average Session</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">{averageSessionMin} mins</h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Per active focus session</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-400">
            <Calendar className="h-4.5 w-4.5 text-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-wider">Sessions Logged</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">{sessions?.length || 0} sessions</h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Completed milestones</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-2 flex items-center space-x-2">
          <PieChart className="h-4.5 w-4.5 text-slate-400" />
          <span>Recent Focus History</span>
        </h3>
        {(!sessions || sessions.length === 0) ? (
          <p className="text-slate-400 text-xs font-semibold py-4">No sessions recorded yet. Start focusing on the dashboard to log your sessions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Course</th>
                  <th className="py-2.5">Lesson</th>
                  <th className="py-2.5 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sessions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5">{new Date(s.started_at).toLocaleDateString()}</td>
                    <td className="py-2.5 text-slate-900">{s.course_name}</td>
                    <td className="py-2.5 text-slate-500">{s.lesson_name}</td>
                    <td className="py-2.5 text-right text-blue-600 font-mono">{s.duration_minutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
