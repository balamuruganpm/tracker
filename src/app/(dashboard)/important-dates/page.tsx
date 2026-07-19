import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DatesClient from './DatesClient'

export default async function ImportantDatesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all saved important dates
  const { data: dates } = await supabase
    .from('important_dates')
    .select('*')
    .order('event_date', { ascending: true })

  // Fetch current user details for roles
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, roles(name)')
    .eq('id', user.id)
    .single()

  const userRole = (profile?.roles as any)?.name || 'Viewer'

  return (
    <DatesClient initialDates={dates || []} userRole={userRole} />
  )
}
