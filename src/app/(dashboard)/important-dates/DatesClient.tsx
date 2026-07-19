'use strict'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Plus, Calendar, Image, Trash2, Mail, AlertCircle } from 'lucide-react'

interface DatesClientProps {
  initialDates: any[]
  userRole: string
}

export default function DatesClient({ initialDates, userRole }: DatesClientProps) {
  const supabase = createClient()
  const [dates, setDates] = useState<any[]>(initialDates)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mailSentAlert, setMailSentAlert] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [reminderText, setReminderText] = useState('')

  const handleAddDate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMailSentAlert(false)

    try {
      const { data, error: err } = await supabase
        .from('important_dates')
        .insert([{
          title,
          event_date: eventDate,
          image_url: imageUrl || null,
          reminder_text: reminderText || null
        }])
        .select()

      if (err) throw err

      setDates([...dates, data[0]].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()))
      setShowForm(false)
      setTitle('')
      setEventDate('')
      setImageUrl('')
      setReminderText('')
      
      // Show romantic email verification toast/alert
      setMailSentAlert(true)
      setTimeout(() => setMailSentAlert(false), 8000)
    } catch (err: any) {
      setError(err?.message || 'Failed to save milestone.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDate = async (id: string) => {
    if (!confirm('Are you sure you want to remove this memory?')) return
    try {
      const { error: err } = await supabase
        .from('important_dates')
        .delete()
        .eq('id', id)

      if (err) throw err
      setDates(dates.filter(d => d.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  // Format date display (without year to count annually)
  const formatAnnualDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-100 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500 fill-current animate-pulse" />
            <span>Our Special Moments & Memories</span>
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Special dates that we celebrate together forever</p>
        </div>
        {userRole === 'Admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>{showForm ? 'Cancel' : 'Add Memory'}</span>
          </button>
        )}
      </div>

      {/* Romantic Email Alert Box */}
      {mailSentAlert && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-xs text-rose-700 backdrop-blur-sm flex items-center space-x-3 shadow-md animate-bounce">
          <Mail className="h-5 w-5 text-rose-600 shrink-0 animate-pulse" />
          <div>
            <span className="font-bold">Reminder Setup Done!</span> Annual email reminders successfully configured. Notifications will be sent to <span className="font-semibold text-rose-900">balaedsty@gmail.com</span> & <span className="font-semibold text-rose-900">Sudharanim024@gmail.com</span> on this date! 💌
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Add Date Form */}
      {showForm && (
        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-md max-w-xl ring-1 ring-rose-500/5">
          <form onSubmit={handleAddDate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Milestone / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Our Proposal Anniversary ❤️"
                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-400 bg-white"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Memory Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/our-proposal.jpg"
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-400 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reminder Text / Love Message</label>
              <textarea
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                rows={3}
                placeholder="A sweet quote or reminder for this day..."
                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-400 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 text-sm font-bold text-white shadow-md hover:from-rose-600 hover:to-pink-700 transition-all active:scale-[0.98]"
            >
              {loading ? 'Saving memory...' : 'Save Special Date ❤️'}
            </button>
          </form>
        </div>
      )}

      {/* Special Dates Grid */}
      {dates.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-semibold text-xs border border-dashed border-rose-100 rounded-2xl bg-white flex flex-col items-center justify-center space-y-3">
          <span className="text-3xl">💝</span>
          <span>No milestones logged yet. Click Add Memory to record our special dates!</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {dates.map((date) => (
            <div key={date.id} className="rounded-2xl border border-rose-50 bg-white shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow relative ring-1 ring-rose-500/5">
              
              {/* Optional Memory Image Preview */}
              {date.image_url && (
                <div className="aspect-video w-full overflow-hidden bg-slate-50 border-b border-rose-50 relative">
                  <img 
                    src={date.image_url} 
                    alt={date.title} 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Every {formatAnnualDate(date.event_date)}</span>
                    </span>
                    
                    {userRole === 'Admin' && (
                      <button 
                        onClick={() => handleDeleteDate(date.id)}
                        className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors"
                        title="Delete Memory"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                    <span>{date.title}</span>
                    <span className="text-sm">💖</span>
                  </h3>
                  
                  {date.reminder_text && (
                    <p className="text-xs font-medium text-slate-500 leading-relaxed italic bg-rose-50/30 p-3 rounded-xl border border-rose-100/30">
                      "{date.reminder_text}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-50 pt-3">
                  <Mail className="h-3.5 w-3.5 text-rose-400" />
                  <span>Annual email active for us</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
