'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, User, Sparkles } from 'lucide-react'

interface ProfileClientProps {
  profile: any
  userId: string
  userEmail: string
  userRole: string
}

export default function ProfileClient({ profile, userId, userEmail, userRole }: ProfileClientProps) {
  const supabase = createClient()

  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '')
  const [dreamCompany, setDreamCompany] = useState(profile?.dream_company || '')
  const [currentCompany, setCurrentCompany] = useState(profile?.current_company || '')
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const skillsArray = skills.split(',').map((s: string) => s.trim()).filter(Boolean)

      const { error: err } = await supabase
        .from('profiles')
        .update({
          name,
          bio,
          skills: skillsArray,
          dream_company: dreamCompany,
          current_company: currentCompany,
          github_url: githubUrl,
          linkedin_url: linkedinUrl
        })
        .eq('id', userId)

      if (err) throw err

      alert('Profile updated successfully!')
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm max-w-2xl space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-600 text-xl uppercase">
          {name[0] || userEmail[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{name || 'User'}</h2>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">{userRole}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t border-neutral-50">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase">Email Address</label>
            <input
              type="email"
              disabled
              value={userEmail}
              className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-400 bg-neutral-50 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase">Skills (comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Power Apps"
            className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase">Current Company</label>
            <input
              type="text"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase">Dream Company</label>
            <input
              type="text"
              value={dreamCompany}
              onChange={(e) => setDreamCompany(e.target.value)}
              className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase">GitHub Profile URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase">LinkedIn Profile URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4.5 w-4.5" />
          <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  )
}
