'use strict'
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, Terminal, Database, Users, GraduationCap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDevTools, setShowDevTools] = useState(false)
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0)

  const quotes = [
    "Together is our favorite place to be. ❤️",
    "Connecting hearts, tracking growth: Bala & Sudha.",
    "Bala & Sudha: Day by day, hand in hand. 🌸",
    "Success is better when shared with you. ✨",
    "To my beautiful wife / loving husband: Let's grow together."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIdx(prev => (prev + 1) % quotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

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
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-900 via-slate-950 to-pink-950 px-4 py-12 font-sans overflow-hidden">
      
      {/* Floating Animated Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 text-rose-500/20 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>❤️</div>
        <div className="absolute top-1/3 right-12 text-pink-500/10 text-6xl animate-pulse" style={{ animationDuration: '5s' }}>💖</div>
        <div className="absolute bottom-1/4 left-1/5 text-rose-600/15 text-5xl animate-bounce" style={{ animationDuration: '4.5s' }}>❤️</div>
        <div className="absolute bottom-1/3 right-1/4 text-pink-600/20 text-3xl animate-pulse" style={{ animationDuration: '3.5s' }}>💕</div>
        <div className="absolute top-10 left-1/3 text-rose-500/10 text-7xl animate-bounce" style={{ animationDuration: '6s' }}>💝</div>
      </div>

      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-rose-500/10 blur-[128px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-[128px]"></div>

      <div className="relative w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-rose-500/10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20 mb-4 ring-1 ring-white/10 animate-pulse">
              <Heart className="h-6 w-6 text-white fill-current" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-rose-100 to-pink-200 bg-clip-text text-transparent">
              Project 730
            </h2>
            <p className="mt-2 text-xs font-semibold text-rose-300 transition-opacity duration-500 min-h-6">
              {quotes[activeQuoteIdx]}
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-rose-950/40 border border-rose-500/20 p-4 text-xs text-rose-300 font-semibold flex items-start space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
            <div>
              <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-2">Username</label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all duration-200"
                placeholder="bala or sudha"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-rose-300 uppercase tracking-wider mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:from-rose-500 hover:to-pink-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Connecting...</span>
                </span>
              ) : (
                'Enter our Dashboard ❤️'
              )}
            </button>
          </form>

          {/* Development tools section */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 border-t border-white/5 pt-6">
              <button
                onClick={() => setShowDevTools(!showDevTools)}
                className="flex w-full items-center justify-between text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4" />
                  <span>DEVELOPER UTILITIES</span>
                </span>
                {showDevTools ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showDevTools && (
                <div className="mt-4 space-y-2 rounded-xl bg-slate-950/40 p-4 border border-white/5">
                  <button
                    onClick={async () => {
                      setLoading(true)
                      setError(null)
                      try {
                        const res = await fetch('/api/admin/init-db', { method: 'POST' })
                        const data = await res.json()
                        if (data.error) throw new Error(data.error)
                        alert('Database schema & tables initialized successfully!')
                      } catch (err: any) {
                        setError(err.message)
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="flex w-full items-center space-x-3 rounded-lg bg-slate-900/60 border border-white/5 px-3 py-2 text-[10px] font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Database className="h-4 w-4 text-blue-400" />
                    <span>1. Initialize Tables & Schema</span>
                  </button>

                  <button
                    onClick={async () => {
                      setLoading(true)
                      setError(null)
                      try {
                        const res = await fetch('/api/admin/seed-users', { method: 'POST' })
                        const data = await res.json()
                        if (data.error) throw new Error(data.error)
                        alert('Default users (bala & sudha) created successfully!')
                      } catch (err: any) {
                        setError(err.message)
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="flex w-full items-center space-x-3 rounded-lg bg-slate-900/60 border border-white/5 px-3 py-2 text-[10px] font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Users className="h-4 w-4 text-indigo-400" />
                    <span>2. Seed Default Users</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
