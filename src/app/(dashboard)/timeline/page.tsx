import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TimelineClient from './TimelineClient'

export default async function TimelinePage() {
  const supabase = await createClient()

  // Fetch session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch role
  const { data: profile } = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single()

  const userRole = (profile?.roles as any)?.name || 'Viewer'

  // Fetch timeline events
  const { data: events } = await supabase
    .from('timeline')
    .select('*')
    .order('event_date', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Career & Study Timeline</h1>
          <p className="text-neutral-500 mt-1">A chronologically rendered track of certifications, job transitions, and milestones.</p>
        </div>
      </div>

      <TimelineClient initialEvents={events || []} userRole={userRole} />
    </div>
  )
}
