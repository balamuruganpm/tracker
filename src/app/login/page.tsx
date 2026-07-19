'use strict'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formattedEmail = email.includes('@') ? email : `${email.trim()}@project730.local`
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password,
      })

      if (authError) {
        setError(authError.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFB] px-4 font-sans">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 mb-4"></div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Project 730</h2>
          <p className="mt-2 text-sm text-neutral-500">Sign in to your learning dashboard</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSignIn}>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Username</label>
            <input
              id="email"
              name="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="bala or sudha"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {process.env.NODE_ENV === 'development' && (
          <div className="border-t border-neutral-100 pt-6 text-center">
            <button
              onClick={async () => {
                setLoading(true)
                setError(null)
                try {
                  const res = await fetch('/api/admin/seed-users', { method: 'POST' })
                  const data = await res.json()
                  if (data.error) throw new Error(data.error)
                  alert('Users initialized successfully! You can now log in using "bala" and "sudha".')
                } catch (err: any) {
                  setError(err.message)
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Initialize Database Users
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
