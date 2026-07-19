'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Award, ExternalLink, Calendar } from 'lucide-react'

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
  const [notes, setNotes] = useState('')

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
          credential_url: credentialUrl,
          notes
        }])
        .select()

      if (err) throw err

      setCerts([data[0], ...certs])
      setShowForm(false)
      setTitle('')
      setProvider('')
      setIssueDate('')
      setCredentialUrl('')
      setNotes('')
    } catch (err: any) {
      setError(err?.message || 'Failed to save certificate.')
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
            <span>{showForm ? 'Cancel' : 'New Certificate'}</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm max-w-xl">
          <form onSubmit={handleAddCert} className="space-y-4">
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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Provider</label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Microsoft, Coursera, Udemy"
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Issue Date</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Credential URL</label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
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
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
          <Award className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-bold text-neutral-800">No Certificates Registered</h3>
          <p className="text-neutral-500 text-sm mt-1">Complete courses and upload credentials to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert) => (
            <div key={cert.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center space-x-3 mb-4 text-xs font-bold text-neutral-400 uppercase">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Issued {new Date(cert.issue_date).toLocaleDateString()}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 leading-tight">{cert.title}</h3>
                <p className="text-sm font-semibold text-blue-600 mt-2">{cert.provider}</p>
                {cert.notes && <p className="text-xs text-neutral-400 mt-3">{cert.notes}</p>}
              </div>

              {cert.credential_url && (
                <div className="mt-6 pt-4 border-t border-neutral-50">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Credential</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
