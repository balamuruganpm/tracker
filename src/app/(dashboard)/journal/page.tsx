import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import JournalClient from './JournalClient'

export default async function JournalPage() {
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

  // Fetch journal entries
  const { data: journal } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Daily Journal</h1>
          <p className="text-neutral-500 mt-1">Reflect on daily progress, mood tracking, and study schedules.</p>
        </div>
      </div>

      <JournalClient initialEntries={journal || []} userRole={userRole} userId={user.id} />
    </div>
  )
}
