import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FinanceClient from './FinanceClient'

export default async function FinancePage() {
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

  // Fetch all finance entries
  const { data: ledger } = await supabase
    .from('finance')
    .select('*')
    .eq('user_id', user.id)
    .order('recorded_date', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Financial Ledger</h1>
        <p className="text-neutral-500 mt-1">Track target savings, current income adjustments, and debt progress.</p>
      </div>

      <FinanceClient ledger={ledger || []} userRole={userRole} userId={user.id} />
    </div>
  )
}
