import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminCurriculumClient from './AdminCurriculumClient'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  if (userRole !== 'Admin') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="max-w-md rounded-2xl bg-red-50 p-8 border border-red-100">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-0">
            Only administrators are authorized to access the curriculum manager.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Curriculum Engine</h1>
        <p className="text-neutral-500 mt-1">Manage the course hierarchy, lesson objectives, tasks, and resources.</p>
      </div>

      <AdminCurriculumClient />
    </div>
  )
}
