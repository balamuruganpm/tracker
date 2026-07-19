import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Heart, Sparkles, Award, Briefcase, Calendar, Clock, BookOpen, Quote } from 'lucide-react'

export default async function JourneyTogetherPage() {
  const supabase = await createClient()

  // Fetch metrics for display
  const { count: certCount } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })

  const { count: projCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  // Study hours
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('completed', true)

  const totalMinutes = sessions?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0
  const totalHours = (totalMinutes / 60).toFixed(1)

  // Fetch latest upload
  const { data: latestUpload } = await supabase
    .from('practice_uploads')
    .select('image_url, uploaded_at, task:tasks(title, lesson:lessons(title, chapter:chapters(module:modules(course:courses(title)))))')
    .order('uploaded_at', { ascending: false })
    .limit(1)
    .single()

  // Calculate elapsed
  const startDate = new Date('2026-07-20')
  const elapsed = Date.now() - startDate.getTime()
  const elapsedDays = Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)))
  const remainingDays = Math.max(0, 730 - elapsedDays)

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-600 p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>Viewer Center</span>
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Our Journey Together</h1>
          <p className="text-rose-100 text-sm max-w-lg">
            Tracking Balamurugan's progress, career growth milestones, and daily study consistency for 730 days.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Motivational message quote */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-6 flex items-start space-x-4">
        <Quote className="h-10 w-10 text-rose-300 transform -scale-x-100 shrink-0" />
        <div className="space-y-1">
          <p className="text-neutral-700 italic font-medium">
            "Your support fuels my growth. Every hour logged, every coding task submitted, and every milestone reached brings us closer to our shared dreams."
          </p>
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mt-1">— Balamurugan</p>
        </div>
      </div>

      {/* Grid: Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Days Active</span>
            <Calendar className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-neutral-900">Day {elapsedDays}</h3>
            <p className="text-xs text-neutral-400 font-semibold mt-1">{remainingDays} days remaining</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Study Log</span>
            <Clock className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-neutral-900">{totalHours}h</h3>
            <p className="text-xs text-neutral-400 font-semibold mt-1">Total study time completed</p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Milestones</span>
            <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" />
          </div>
          <div className="flex space-x-4">
            <div>
              <h4 className="text-2xl font-bold text-neutral-900">{projCount || 0}</h4>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Projects</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-neutral-900">{certCount || 0}</h4>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">Certificates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Screenshot Upload */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-neutral-900">Latest Practice Submission</h3>
        {latestUpload ? (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-neutral-100 aspect-video relative max-h-96">
              <img
                src={latestUpload.image_url}
                alt="Latest practice screenshot"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                {(latestUpload as any).task?.title || 'Practice Submission'}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Uploaded on {new Date((latestUpload as any).uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center text-sm text-neutral-500">
            No practice screenshots uploaded yet.
          </div>
        )}
      </div>
    </div>
  )
}
