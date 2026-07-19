'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Award, ExternalLink, Calendar, Trash2 } from 'lucide-react'

interface CertificatesClientProps {
  initialCerts: any[]
  userRole: string
}

export default function CertificatesClient({ initialCerts, userRole }: CertificatesClientProps) {
  const supabase = createClient()
  const [certs, setCerts] = useState<any[]>(initialCerts)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [provider, setProvider] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [credentialId, setCredentialId] = useState('')

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('certificates')
        .insert([{
          title,
          provider,
          issue_date: issueDate,
          credential_url: credentialUrl || null,
          notes: credentialId || null // storing Credential ID in the notes column for simplicity
        }])
        .select()

      if (err) throw err

      setCerts([data[0], ...certs])
      setShowForm(false)
      setTitle('')
      setProvider('')
      setIssueDate('')
      setCredentialUrl('')
      setCredentialId('')
    } catch (err: any) {
      setError(err?.message || 'Failed to save certificate.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    try {
      const { error: err } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id)

      if (err) throw err
      setCerts(certs.filter(c => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Certificates Workspace</h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Manage and showcase your industry credentials</p>
        </div>
        {userRole === 'Admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{showForm ? 'Cancel' : 'Add Certificate'}</span>
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
          <form onSubmit={handleAddCert} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Certificate Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Provider</label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Microsoft, Coursera, etc."
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Issue Date</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Credential ID</label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Verification URL</label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Saving...' : 'Add Certificate'}
            </button>
          </form>
        </div>
      )}

      {certs.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-semibold text-xs border border-dashed border-slate-100 rounded-2xl bg-white">
          No certificates uploaded yet. Click Add Certificate to record your credentials.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((cert) => (
            <div key={cert.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">{cert.title}</h3>
                </div>
                <p className="text-xs font-semibold text-slate-500">{cert.provider} &bull; Issued {new Date(cert.issue_date).toLocaleDateString()}</p>
                {cert.notes && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID: {cert.notes}</p>}
                
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 pt-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Verify Credential</span>
                  </a>
                )}
              </div>

              {userRole === 'Admin' && (
                <button 
                  onClick={() => handleDeleteCert(cert.id)}
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-slate-50 transition-colors"
                  title="Delete Certificate"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
