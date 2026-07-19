'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, GitFork, ExternalLink, Calendar, Edit3, Circle, Star } from 'lucide-react'

interface ProjectsClientProps {
  initialProjects: any[]
  userRole: string
}

export default function ProjectsClient({ initialProjects, userRole }: ProjectsClientProps) {
  const supabase = createClient()
  const [projects, setProjects] = useState<any[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveDemoUrl, setLiveDemoUrl] = useState('')
  const [techStack, setTechStack] = useState('')
  const [status, setStatus] = useState('Not Started')

  const handleOpenNewForm = () => {
    setEditingProject(null)
    setTitle('')
    setDescription('')
    setGithubUrl('')
    setLiveDemoUrl('')
    setTechStack('')
    setStatus('Not Started')
    setShowForm(!showForm)
  }

  const handleOpenEditForm = (project: any) => {
    setEditingProject(project)
    setTitle(project.title || '')
    setDescription(project.description || '')
    setGithubUrl(project.github_url || '')
    setLiveDemoUrl(project.live_demo_url || '')
    setTechStack(project.tech_stack ? project.tech_stack.join(', ') : '')
    setStatus(project.status || 'Not Started')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      title,
      description,
      github_url: githubUrl || null,
      live_demo_url: liveDemoUrl || null,
      tech_stack: techStack.split(',').map((t: string) => t.trim()).filter(Boolean),
      status
    }

    try {
      if (editingProject) {
        const { data, error: err } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id)
          .select()

        if (err) throw err
        setProjects(projects.map((p) => (p.id === editingProject.id ? data[0] : p)))
      } else {
        const { data, error: err } = await supabase
          .from('projects')
          .insert([payload])
          .select()

        if (err) throw err
        setProjects([data[0], ...projects])
      }

      setShowForm(false)
      setEditingProject(null)
    } catch (err: any) {
      setError(err?.message || 'Failed to save project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Projects Workspace</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">GitHub repository style view of your code assets</p>
        </div>
        {userRole === 'Admin' && (
          <button
            onClick={handleOpenNewForm}
            className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{showForm ? 'Cancel' : 'New Project'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="React, TypeScript, Supabase"
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">GitHub Link</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Live Demo Link</label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
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
              {loading ? 'Saving...' : editingProject ? 'Save Changes' : 'Add Project'}
            </button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <GitFork className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800">No Repositories Logged</h3>
          <p className="text-slate-500 text-sm mt-1">Start adding projects to showcase your growth journey.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {projects.map((project) => (
            <div key={project.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="space-y-2 md:w-3/4">
                <div className="flex items-center space-x-2.5">
                  <GitFork className="h-4.5 w-4.5 text-slate-400" />
                  <h3 className="text-base font-bold text-blue-600 hover:underline cursor-pointer">{project.title}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    project.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{project.description}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1.5 text-[10px] text-slate-400 font-bold">
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Circle className="h-2 w-2 fill-current text-blue-500" />
                      <span>{project.tech_stack.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Updated {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 md:w-1/4 justify-end">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    <span>Repo</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.live_demo_url && (
                  <a
                    href={project.live_demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>Demo</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {userRole === 'Admin' && (
                  <button 
                    onClick={() => handleOpenEditForm(project)}
                    className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
