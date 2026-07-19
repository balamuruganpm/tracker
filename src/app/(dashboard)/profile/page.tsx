import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Fetch session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, roles(name)')
    .eq('id', user.id)
    .single()

  const userRole = (profile?.roles as any)?.name || 'Viewer'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">User Profile</h1>
        <p className="text-neutral-500 mt-1">Manage profile bio, skills, and account details.</p>
      </div>

      <ProfileClient
        profile={profile}
        userId={user.id}
        userEmail={user.email || ''}
        userRole={userRole}
      />
    </div>
  )
}
