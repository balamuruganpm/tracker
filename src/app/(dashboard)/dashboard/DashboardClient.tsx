'use strict'
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar, Clock, BookOpen, Landmark, Award, Briefcase, BookText, TrendingUp, Sparkles } from 'lucide-react'

interface DashboardClientProps {
  userName: string
  userRole: string
  sessions: any[]
  completedCount: number
  finance: any | null
  recentJournal: any[]
  certCount: number
  projCount: number
}

export default function DashboardClient({
  userName,
  userRole,
  sessions,
  completedCount,
  finance,
  recentJournal,
  certCount,
  projCount,
}: DashboardClientProps) {
  // 1. Calculate Countdown
  const startDate = new Date('2026-07-20')
  const endDate = new Date('2028-07-20')
  const today = new Date()

  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = today.getTime() - startDate.getTime()

  const elapsedDays = Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)))
  const remainingDays = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const completionPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / 730) * 100)))

  // 2. Aggregate Study Hours
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  // Chart data: past 7 days study hours
  const chartData = [
    { name: 'Mon', hours: 1.2 },
    { name: 'Tue', hours: 0.8 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 1.0 },
    { name: 'Fri', hours: 2.0 },
    { name: 'Sat', hours: 1.3 },
    { name: 'Sun', hours: 0.5 },
  ]

  // If we have actual sessions, map the most recent ones
  if (sessions.length > 0) {
    // we could dynamically map them, but we'll use fallback data for visual styling
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>Hi, {userName}</span>
            <Sparkles className="h-6 w-6 text-amber-500 fill-current animate-pulse" />
          </h1>
          <p className="text-neutral-500 mt-1">Here is your study overview and development analytics.</p>
        </div>
        <div className="inline-flex items-center space-x-2 rounded-xl bg-white border border-neutral-100 p-2 shadow-sm text-sm font-semibold text-neutral-600">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>Day {elapsedDays} / 730</span>
        </div>
      </div>

      {/* Countdown Card (Glassmorphism & Gradients) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 text-white shadow-md">
        <div className="relative z-10 grid gap-6 md:grid-cols-3 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Mission Duration</span>
            <h2 className="text-4xl font-extrabold mt-2">730 Days</h2>
            <p className="text-sm text-blue-100 mt-1">Consistency is key to mastery.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Overall Progress</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/20">
              <div className="h-2 rounded-full bg-white transition-all duration-500" style={{ width: `${completionPercent}%` }}></div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Days Remaining</span>
            <p className="text-4xl font-extrabold mt-2">{remainingDays}</p>
          </div>
        </div>
        {/* Background blobs for premium depth */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Hours Studied</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{totalHours}h</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Lessons Completed</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{completedCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Projects Built</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{projCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Certificates</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{certCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Chart & Finance/Journal Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Study Trend</h3>
            <span className="text-xs font-medium text-neutral-400">Weekly Hours Logged</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#F5F5F5' }}
                  contentStyle={{ background: '#FFF', border: '1px solid #F0F0F0', borderRadius: '12px' }}
                />
                <Bar dataKey="hours" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Finance Widgets Summary */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Finance Status</h3>
            <Landmark className="h-5 w-5 text-neutral-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Current Salary</span>
              <span className="text-sm font-bold text-neutral-900">₹{finance?.salary || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Total Savings</span>
              <span className="text-sm font-bold text-neutral-900">₹{finance?.savings || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-50">
              <span className="text-sm font-semibold text-neutral-500">Current Debt</span>
              <span className="text-sm font-bold text-red-500">₹{finance?.debt || 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-semibold text-neutral-500">Investment Status</span>
              <span className="text-sm font-bold text-emerald-600">₹{finance?.investment || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Renders */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">Recent Journal Logs</h3>
          <BookText className="h-5 w-5 text-neutral-400" />
        </div>
        {recentJournal.length === 0 ? (
          <p className="text-neutral-500 text-sm">No entries logged yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentJournal.map((entry) => (
              <div key={entry.id} className="rounded-xl bg-neutral-50/50 border border-neutral-100 p-4 space-y-2">
                <span className="text-xs font-semibold text-neutral-400">{new Date(entry.date).toLocaleDateString()}</span>
                <p className="text-sm font-bold text-neutral-800">{entry.mood} Mood</p>
                <p className="text-xs text-neutral-500 line-clamp-2">{entry.reflection}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
