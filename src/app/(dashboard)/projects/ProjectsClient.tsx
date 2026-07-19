'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Code2, ExternalLink, Briefcase, Calendar, Check } from 'lucide-react'

interface ProjectsClientProps {
  initialProjects: any[]
  userRole: string
}

export default function ProjectsClient({ initialProjects, userRole }: ProjectsClientProps) {
  const supabase = createClient()
  const [projects, setProjects] = useState<any[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveDemoUrl, setLiveDemoUrl] = useState('')
  const [techStack, setTechStack] = useState('')
  const [status, setStatus] = useState('Not Started')

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('projects')
        .insert([{
          title,
          description,
          github_url: githubUrl,
          live_demo_url: liveDemoUrl,
          tech_stack: techStack.split(',').map((t: string) => t.trim()).filter(Boolean),
          status
        }])
        .select()

      if (err) throw err

      setProjects([data[0], ...projects])
      setShowForm(false)
      setTitle('')
      setDescription('')
      setGithubUrl('')
      setLiveDemoUrl('')
      setTechStack('')
      setStatus('Not Started')
    } catch (err: any) {
      setError(err?.message || 'Failed to save project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {userRole === 'Admin' && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{showForm ? 'Cancel' : 'New Project'}</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm max-w-xl">
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="React, TypeScript, Supabase"
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">GitHub Link</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Live Demo Link</label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500 bg-white"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Saving...' : 'Add Project'}
            </button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
          <Briefcase className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-bold text-neutral-800">No Projects Logged</h3>
          <p className="text-neutral-500 text-sm mt-1">Start adding projects to showcase your growth journey.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{project.title}</h3>
                <p className="text-sm text-neutral-500 mt-2">{project.description}</p>

                {/* Tech tags */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tech_stack.map((tech: string, i: number) => (
                      <span key={i} className="rounded bg-neutral-50 px-2 py-0.5 text-xs font-semibold text-neutral-500 border border-neutral-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-neutral-50">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900"
                  >
                    <Code2 className="h-4 w-4" />
                    <span>Repository</span>
                  </a>
                )}
                {project.live_demo_url && (
                  <a
                    href={project.live_demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
