'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Calendar, Bookmark, Briefcase, Award, Landmark, Sparkles } from 'lucide-react'

interface TimelineClientProps {
  initialEvents: any[]
  userRole: string
}

export default function TimelineClient({ initialEvents, userRole }: TimelineClientProps) {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Learning')
  const [eventDate, setEventDate] = useState('')

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('timeline')
        .insert([{
          title,
          description,
          category,
          event_date: eventDate
        }])
        .select()

      if (err) throw err

      setEvents([data[0], ...events])
      setShowForm(false)
      setTitle('')
      setDescription('')
      setCategory('Learning')
      setEventDate('')
    } catch (err: any) {
      setError(err?.message || 'Failed to save timeline event.')
    } finally {
      setLoading(false)
    }
  }

  // Get category icon
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Career': return <Briefcase className="h-4 w-4" />
      case 'Finance': return <Landmark className="h-4 w-4" />
      case 'Projects': return <Bookmark className="h-4 w-4" />
      case 'Achievements': return <Award className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
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
            <span>{showForm ? 'Cancel' : 'Add Event'}</span>
          </button>
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm max-w-xl">
          <form onSubmit={handleAddEvent} className="space-y-4">
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
                rows={2}
                className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Learning">Learning</option>
                  <option value="Career">Career</option>
                  <option value="Finance">Finance</option>
                  <option value="Projects">Projects</option>
                  <option value="Achievements">Achievements</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full mt-1 rounded-lg border px-3 py-2 text-sm text-neutral-800 outline-none focus:border-blue-500 bg-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Saving...' : 'Add Event'}
            </button>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
          <Calendar className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
          <h3 className="font-bold text-neutral-800">Timeline Empty</h3>
          <p className="text-neutral-500 text-sm mt-1">Timeline events will generate automatically during progress updates.</p>
        </div>
      ) : (
        <div className="relative border-l border-neutral-200 ml-4 md:ml-6 space-y-8">
          {events.map((event) => (
            <div key={event.id} className="relative pl-8 md:pl-10">
              {/* Dot Icon */}
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-neutral-200 text-blue-600 shadow-sm">
                {getCategoryIcon(event.category)}
              </span>

              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-400 uppercase">
                  {new Date(event.event_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-neutral-900 leading-tight">{event.title}</h3>
                  <span className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100/50">
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 max-w-2xl">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
