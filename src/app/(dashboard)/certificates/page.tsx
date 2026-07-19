import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CertificatesClient from './CertificatesClient'

export default async function CertificatesPage() {
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

  // Fetch certificates
  const { data: certs } = await supabase
    .from('certificates')
    .select('*')
    .order('issue_date', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Certificates</h1>
          <p className="text-neutral-500 mt-1">Review earned course completions and official credentials.</p>
        </div>
      </div>

      <CertificatesClient initialCerts={certs || []} userRole={userRole} />
    </div>
  )
}
