import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProjectsClient from './ProjectsClient'

export default async function ProjectsPage() {
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

  // Fetch projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Projects</h1>
          <p className="text-neutral-500 mt-1">Review development code repositories, statuses, and live demos.</p>
        </div>
      </div>

      <ProjectsClient initialProjects={projects || []} userRole={userRole} />
    </div>
  )
}
