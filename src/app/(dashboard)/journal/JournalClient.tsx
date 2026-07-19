'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, BookText, Smile, CheckCircle, Brain, Calendar } from 'lucide-react'

interface JournalClientProps {
  initialEntries: any[]
  userRole: string
  userId: string
}

export default function JournalClient({ initialEntries, userRole, userId }: JournalClientProps) {
  const supabase = createClient()
  const [entries, setEntries] = useState<any[]>(initialEntries)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [mood, setMood] = useState('Productive')
  const [studyHours, setStudyHours] = useState('0')
  const [reflection, setReflection] = useState('')
  const [tomorrowPlan, setTomorrowPlan] = useState('')
  const [achievements, setAchievements] = useState('')

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          mood,
          study_hours: parseFloat(studyHours),
          reflection,
          tomorrow_plan: tomorrowPlan,
          achievements: achievements.split(',').map((a) => a.trim()).filter(Boolean)
        }])
        .select()

      if (err) throw err

      setEntries([data[0], ...entries])
      setShowForm(false)
      setMood('Productive')
      setStudyHours('0')
      setReflection('')
      setTomorrowPlan('')
      setAchievements('')
    } catch (err: any) {
      setError(err?.message || 'Failed to save journal log.')
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
            <span>{showForm ? 'Cancel' : 'New Journal Entry'}</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm max-w-xl">
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Productive">Productive</option>
                  <option value="Focused">Focused</option>
                  <option value="Happy">Happy</option>
                  <option value="Tired">Tired</option>
                  <option value="Stressed">Stressed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Study Hours</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Reflection</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                placeholder="What did you learn or struggle with today?"
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Tomorrow's Plan</label>
              <textarea
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                rows={2}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase">Achievements (comma separated)</label>
              <input
                type="text"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="Solved promises quiz, Built flex header"
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Saving...' : 'Add Journal Entry'}
            </button>
          </form>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
          <BookText className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-bold text-neutral-800">No Journal Entries</h3>
          <p className="text-neutral-500 text-sm mt-1">Reflect on your study cycles to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-xs font-bold text-neutral-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-neutral-50 px-2 py-0.5 text-xs font-semibold text-neutral-500 border border-neutral-100">
                    {entry.mood}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Reflection</h4>
                  <p className="text-sm text-neutral-600 mt-1">{entry.reflection || 'No reflection logged.'}</p>
                </div>

                {entry.tomorrow_plan && (
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tomorrow's Plan</h4>
                    <p className="text-sm text-neutral-600 mt-1">{entry.tomorrow_plan}</p>
                  </div>
                )}

                {entry.achievements && entry.achievements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Achievements</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.achievements.map((ach: string, i: number) => (
                        <span key={i} className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100/50">
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-50 flex items-center justify-between text-xs font-semibold text-neutral-400">
                <span>Study duration</span>
                <span className="font-bold text-neutral-800">{entry.study_hours}h</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
