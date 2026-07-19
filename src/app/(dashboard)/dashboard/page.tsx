import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch profile & role info
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, roles(name)')
    .eq('id', user.id)
    .single()

  const userName = profile?.name || user.email?.split('@')[0] || 'User'
  const userRole = (profile?.roles as any)?.name || 'Viewer'

  // 3. Fetch study hours & sessions
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes, started_at')
    .eq('user_id', user.id)
    .eq('completed', true)

  // 4. Fetch progress stats
  const { data: completedProgress } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'Completed')

  // 5. Fetch finance metrics
  const { data: finance } = await supabase
    .from('finance')
    .select('*')
    .eq('user_id', user.id)
    .order('recorded_date', { ascending: false })
    .limit(1)
    .single()

  // 6. Fetch recent journal entries
  const { data: journal } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(3)

  // 7. Fetch certificates count
  const { count: certCount } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })

  // 8. Fetch projects count
  const { count: projCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  return (
    <DashboardClient
      userName={userName}
      userRole={userRole}
      sessions={sessions || []}
      completedCount={completedProgress?.length || 0}
      finance={finance || null}
      recentJournal={journal || []}
      certCount={certCount || 0}
      projCount={projCount || 0}
    />
  )
}
