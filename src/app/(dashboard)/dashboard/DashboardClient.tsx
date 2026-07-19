"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Play,
  Pause, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  Briefcase, 
  Award, 
  Heart, 
  Sparkles, 
  Bell, 
  ChevronDown, 
  Trophy, 
  Calendar,
  Smile,
  Zap,
  Music,
  HeartCrack,
  Moon
} from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

interface DashboardClientProps {
  userName: string
  userRole: string
  sessions: any[]
  completedCount: number
  totalLessonsCount: number
  finance: any | null
  recentJournal: any[]
  certCount: number
  projCount: number
}

export default function DashboardClient({
  userName,
  userRole,
  sessions: initialSessions,
  completedCount,
  totalLessonsCount,
  finance,
  recentJournal,
  certCount,
  projCount,
}: DashboardClientProps) {
  const supabase = createClient()
  const [sessions, setSessions] = useState<any[]>(initialSessions)
  const [isFocusActive, setIsFocusActive] = useState(false)
  const [focusMode, setFocusMode] = useState<'pomodoro' | 'deepwork' | 'custom'>('pomodoro')
  const [timerSeconds, setTimerSeconds] = useState(1500) // 25 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeCourse, setActiveCourse] = useState('JavaScript Complete Course')
  const [activeLesson, setActiveLesson] = useState('What is JavaScript?')
  const [activeChapter, setActiveChapter] = useState('Introduction to JavaScript')
  const [focusNotes, setFocusNotes] = useState('')
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [heartClickCount, setHeartClickCount] = useState(0)
  const [showSurprise, setShowSurprise] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0.00)
  const [daysRemaining, setDaysRemaining] = useState(730)

  const startDate = new Date('2026-07-19T00:00:00')
  const endDate = new Date('2028-07-17T00:00:00')

  // Quotes carousel
  const loveQuotes = [
    "Every day together is another beautiful page of our story. ❤️",
    "You are my today and all of my tomorrows. 🌸",
    "Growing together, hand in hand, learning side by side.",
    "Together is our favorite place to be. ✨",
    "Success is sweeter when it is built with you. 💝",
  ]
  const [dailyQuote, setDailyQuote] = useState(loveQuotes[0])

  useEffect(() => {
    setMounted(true)
    const calculateTime = () => {
      const now = new Date()
      const total = endDate.getTime() - startDate.getTime()
      const elapsed = now.getTime() - startDate.getTime()
      const remaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      const percent = Math.min(100, Math.max(0, parseFloat(((elapsed / total) * 100).toFixed(4))))
      setDaysRemaining(remaining)
      setOverallProgress(percent)
    }

    calculateTime()
    setDailyQuote(loveQuotes[Math.floor(Math.random() * loveQuotes.length)])
    const interval = setInterval(calculateTime, 86400000) // update daily
    return () => clearInterval(interval)
  }, [])

  // Focus Timer Logic
  useEffect(() => {
    let interval: any = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      handleFinishSession()
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds])

  // Custom Event Listener for Global Mobile Float Trigger
  useEffect(() => {
    const handleOpenFocus = () => {
      setIsFocusActive(true)
      startTimer()
    }
    window.addEventListener('open-focus-timer', handleOpenFocus)
    return () => window.removeEventListener('open-focus-timer', handleOpenFocus)
  }, [])

  const startTimer = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date())
    }
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    if (focusMode === 'pomodoro') setTimerSeconds(1500)
    else if (focusMode === 'deepwork') setTimerSeconds(3000)
    else setTimerSeconds(1500)
  }

  const handleFinishSession = async () => {
    setIsTimerRunning(false)
    const end = new Date()
    const start = sessionStartTime || new Date()
    const durationMin = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000))

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: newSession } = await supabase
          .from('study_sessions')
          .insert({
            user_id: user.id,
            course_name: activeCourse,
            lesson_name: activeLesson,
            duration_minutes: durationMin,
            notes: focusNotes,
            completed: true,
            started_at: start.toISOString(),
            ended_at: end.toISOString()
          })
          .select()
          .single()

        if (newSession) {
          setSessions(prev => [newSession, ...prev])
        }
      }
    } catch (err) {
      console.error('Failed to log study session:', err)
    }

    setIsFocusActive(false)
    setSessionStartTime(null)
    setFocusNotes('')
    resetTimer()
    alert(`Great job! Focus session of ${durationMin} minutes recorded.`)
  }

  const handleModeChange = (mode: 'pomodoro' | 'deepwork' | 'custom') => {
    setFocusMode(mode)
    setIsTimerRunning(false)
    if (mode === 'pomodoro') setTimerSeconds(1500)
    else if (mode === 'deepwork') setTimerSeconds(3000)
    else {
      const customMin = prompt('Enter custom timer duration (minutes):', '25')
      const mins = parseInt(customMin || '25')
      setTimerSeconds(isNaN(mins) ? 1500 : mins * 60)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Calculate statistics
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  const todayMinutes = sessions
    .filter(s => new Date(s.started_at || s.created_at).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const todayHoursFormatted = `${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m`

  const weeklyMinutes = sessions
    .filter(s => {
      const date = new Date(s.started_at || s.created_at)
      const diff = new Date().getTime() - date.getTime()
      return diff < 7 * 24 * 60 * 60 * 1000
    })
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
  const weeklyHoursFormatted = `${Math.floor(weeklyMinutes / 60)}h ${weeklyMinutes % 60}m`

  // GitHub contribution heatmap helper (365 squares)
  const renderHeatmap = () => {
    const days = []
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() - 364) // start 364 days ago

    for (let i = 0; i < 365; i++) {
      const loopDate = new Date(baseDate)
      loopDate.setDate(loopDate.getDate() + i)
      const dateString = loopDate.toDateString()
      
      const daySessions = sessions.filter(s => new Date(s.started_at || s.created_at).toDateString() === dateString)
      const sessionCount = daySessions.length
      
      let colorClass = 'bg-rose-50'
      if (sessionCount === 1) colorClass = 'bg-rose-200'
      else if (sessionCount === 2) colorClass = 'bg-pink-300'
      else if (sessionCount >= 3) colorClass = 'bg-rose-500'

      days.push(
        <div 
          key={i} 
          className={`h-2.5 w-2.5 rounded-sm ${colorClass} transition-colors hover:ring-1 hover:ring-rose-400`}
          title={`${dateString}: ${sessionCount} session(s)`}
        />
      )
    }
    return days
  }

  // Study progress mock values matching typical course roadmap
  const jsProgress = totalLessonsCount ? Math.round((completedCount / totalLessonsCount) * 100) : 0;
  const coursesProgress = [
    { name: 'JavaScript Complete Course', progress: jsProgress },
    { name: 'React Complete Path', progress: 0 },
    { name: 'TypeScript Guide', progress: 0 },
    { name: 'SPFx & SharePoint Dev', progress: 0 },
    { name: 'Power Platform Path', progress: 0 },
  ]

  const handleHeartClick = () => {
    const nextCount = heartClickCount + 1
    setHeartClickCount(nextCount)
    if (nextCount >= 10) {
      setShowSurprise(true)
      setHeartClickCount(0)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-20 md:pb-6 relative">
      
      {/* Hidden Surprise Overlay */}
      {showSurprise && (
        <div 
          className="fixed inset-0 z-50 bg-rose-950/95 backdrop-blur-md flex flex-col items-center justify-center text-white cursor-pointer select-none"
          onClick={() => setShowSurprise(false)}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-around items-center flex-wrap">
            <span className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>❤️</span>
            <span className="text-5xl animate-pulse" style={{ animationDuration: '3s' }}>💖</span>
            <span className="text-7xl animate-bounce" style={{ animationDuration: '1.5s' }}>💕</span>
            <span className="text-4xl animate-pulse" style={{ animationDuration: '2.5s' }}>💝</span>
          </div>
          <div className="text-center space-y-4 relative z-10 animate-pulse">
            <Heart className="h-24 w-24 text-rose-500 fill-current mx-auto animate-bounce" />
            <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-white via-rose-200 to-white bg-clip-text text-transparent text-center px-4 max-w-2xl leading-snug">
              Every moment we build together becomes tomorrow's favorite memory.
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-300">Our Forever Journey</p>
          </div>
          <p className="absolute bottom-10 text-[10px] text-rose-400 font-bold uppercase tracking-widest">Click anywhere to close surprise</p>
        </div>
      )}

      {/* Redesigned Romantic Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pt-4 border-b border-rose-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Good evening, Balamurugan</h1>
            <span 
              onClick={handleHeartClick} 
              title="Click me 10 times for a surprise!" 
              className="cursor-pointer"
            >
              <Heart className="h-5 w-5 text-rose-500 fill-current animate-pulse hover:scale-125 transition-transform" />
            </span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">"Two hearts, one path."</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsFocusActive(true)}
            className="flex items-center space-x-2 rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all active:scale-[0.98]"
          >
            <Clock className="h-4 w-4" />
            <span>Start Focus Session</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfileDropdown(false)
              }}
              className="relative p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <Bell className="h-4.5 w-4.5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 z-30 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl text-xs font-semibold text-slate-700 animate-fade-in space-y-3">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="font-bold uppercase tracking-wider text-slate-800">Our Reminders</span>
                  <span className="text-[10px] text-rose-500 font-bold">2 Active</span>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-start space-x-2 border-b border-slate-50/50 pb-2">
                    <span>💖</span>
                    <div>
                      <p className="font-bold text-slate-800">Upcoming Anniversary</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Every moment counts. Countdown active!</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>💬</span>
                    <div>
                      <p className="font-bold text-slate-800">New Message in Private Chat</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Let's connect and share a message.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
                setShowNotifications(false)
              }}
              className="flex items-center space-x-2 rounded-xl border border-slate-100 bg-white p-1 px-3.5 shadow-sm text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 select-none"
            >
              <div className="h-5 w-5 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-[10px]">B</div>
              <span>Balamurugan</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 z-30 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl text-xs font-bold text-slate-700 animate-fade-in space-y-1">
                <Link href="/profile" className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                  <span>⚙️</span>
                  <span>Settings</span>
                </Link>
                <form action="/api/auth/signout" method="POST" className="w-full">
                  <button type="submit" className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left font-bold w-full">
                    <span>🚪</span>
                    <span>Log out</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Redesigned Romantic Heart Countdown Banner (Full Width) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-600 to-red-500 p-8 text-white shadow-xl shadow-rose-500/20 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
        
        {/* Floating background glowing hearts */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <span className="absolute top-4 left-6 text-3xl animate-bounce">❤️</span>
          <span className="absolute bottom-4 left-1/3 text-2xl animate-pulse">💖</span>
          <span className="absolute top-2 right-1/4 text-4xl animate-bounce">💕</span>
        </div>

        <div className="space-y-4 relative z-10 md:w-3/5">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-100 flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 fill-current text-white animate-pulse" />
            <span>Our Journey of Love & Growth</span>
          </span>
          <div className="space-y-1.5">
            <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent">
              {daysRemaining} Days Left Together
            </h2>
            <p className="text-xs text-rose-100 font-semibold italic">"{dailyQuote}"</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-rose-100 uppercase tracking-wider">
              <span>Overall Completion</span>
              <span>{mounted ? overallProgress.toFixed(4) : '0.00'}%</span>
            </div>
            <div className="h-2 w-full max-w-md rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${mounted ? overallProgress : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 md:text-right space-y-2 md:w-2/5 flex flex-col md:items-end justify-center">
          <div className="relative flex items-center justify-center h-32 w-32 drop-shadow-2xl animate-pulse">
            {/* SVG Heart Container */}
            <svg className="absolute inset-0 h-full w-full text-white fill-current opacity-20" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div className="text-center z-10 space-y-0.5">
              <span className="text-3xl font-black font-mono leading-none">{daysRemaining}</span>
              <span className="block text-[8px] font-black uppercase tracking-widest text-rose-100">Days Left</span>
            </div>
          </div>
          <div className="text-[10px] text-rose-100 font-bold uppercase tracking-wider space-y-0.5 pt-2">
            <p>Started: 19 Jul 2026</p>
            <p>Target: 17 Jul 2028</p>
          </div>
        </div>
      </div>

      {/* Redesigned High Density 5 Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Focus Today</span>
            <Clock className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">{todayHoursFormatted}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Goal: 3h 00m</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">This Week</span>
            <Zap className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">{weeklyHoursFormatted}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Goal: 21h 00m</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Focus</span>
            <Clock className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">{totalHours}h</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">All Time Hours</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Lessons Done</span>
            <BookOpen className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">{completedCount}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Syllabus Complete</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Projects</span>
            <Briefcase className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-slate-800">{projCount}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">In Progress / Done</p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Study Heatmap */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Study Heatmap</h3>
              <span className="text-xs font-semibold text-slate-400">Past 365 Days</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {renderHeatmap()}
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 justify-end pt-2">
              <span>Less</span>
              <div className="h-2.5 w-2.5 rounded-sm bg-rose-50" />
              <div className="h-2.5 w-2.5 rounded-sm bg-rose-200" />
              <div className="h-2.5 w-2.5 rounded-sm bg-pink-300" />
              <div className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
              <span>More</span>
            </div>
          </div>

          {/* Focus Timer Mini Card */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Focus Study Timer</h3>
                <p className="text-[10px] text-slate-400 font-medium">Stay focused. We'll track the rest.</p>
              </div>
              <span className="inline-flex rounded-xl bg-slate-50 border border-slate-100 p-1 font-bold text-xs text-slate-500 uppercase tracking-wider">
                {focusMode}
              </span>
            </div>

            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="text-5xl font-black font-mono tracking-tight text-slate-900 flex items-center space-x-2">
                <span>{formatTime(timerSeconds)}</span>
                <Clock className="h-6 w-6 text-slate-400 animate-pulse" />
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleModeChange('pomodoro')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    focusMode === 'pomodoro' 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  Pomodoro (25m)
                </button>
                <button 
                  onClick={() => handleModeChange('deepwork')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    focusMode === 'deepwork' 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  Deep Work (50m)
                </button>
                <button 
                  onClick={() => handleModeChange('custom')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    focusMode === 'custom' 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  Custom
                </button>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                {isTimerRunning ? (
                  <button 
                    onClick={pauseTimer}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Pause className="h-5 w-5" />
                  </button>
                ) : (
                  <button 
                    onClick={startTimer}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </button>
                )}
                
                <button 
                  onClick={resetTimer}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>

                <button 
                  onClick={handleFinishSession}
                  className="flex px-4 h-12 items-center justify-center rounded-2xl bg-green-600 text-white text-xs font-bold shadow-md shadow-green-500/10 active:scale-95 transition-all"
                >
                  Finish
                </button>
              </div>
            </div>
          </div>

          {/* Course Progress Bars */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-rose-50 pb-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Course Progress</h3>
              <BookOpen className="h-4.5 w-4.5 text-rose-500" />
            </div>
            <div className="space-y-4">
              {coursesProgress.map((c, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{c.name}</span>
                    <span className="font-mono text-slate-400">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Redesigned 'Our Journey' Widget replacing 'Share progress' */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-rose-50 pb-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Our Journey</h3>
              <Heart className="h-4.5 w-4.5 text-rose-500 fill-current animate-pulse" />
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50/40">
                <span>❤️ Together Since</span>
                <span className="text-rose-600 font-bold">730 Days</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50/40">
                <span>📷 Memories Shared</span>
                <span className="text-rose-600 font-bold">84 memories</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50/40">
                <span>💬 Messages Sent</span>
                <span className="text-rose-600 font-bold">2,481 msgs</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-rose-50/40">
                <span>🎉 Celebrations Logged</span>
                <span className="text-rose-600 font-bold">12 events</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>🌸 Dreams Completed</span>
                <span className="text-rose-600 font-bold">5 dreams</span>
              </div>
            </div>
          </div>

          {/* Overview List Card */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-rose-50 pb-2">Overview</h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center space-x-2">
                  <Heart className="h-4.5 w-4.5 text-rose-500 fill-current" />
                  <span>Current Streak</span>
                </span>
                <span className="font-mono text-slate-800">1 day</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center space-x-2">
                  <Trophy className="h-4.5 w-4.5 text-amber-500" />
                  <span>Longest Streak</span>
                </span>
                <span className="font-mono text-slate-800">1 day</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center space-x-2">
                  <Award className="h-4.5 w-4.5 text-purple-500" />
                  <span>Certificates Earned</span>
                </span>
                <span className="font-mono text-slate-800">{certCount}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Upcoming Milestones</h3>
              <Trophy className="h-4.5 w-4.5 text-amber-500" />
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">First Focus Milestone</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Focus for 5 hours in total</p>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-1.5 text-amber-500 shrink-0">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (parseFloat(totalHours) / 5) * 100)}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>{totalHours} / 5 hrs</span>
                  <span>{Math.round(Math.min(100, (parseFloat(totalHours) / 5) * 100))}%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Focus Session Mode Overlay */}
      {isFocusActive && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 md:p-12 text-white transition-opacity duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">730</div>
              <span className="font-bold tracking-tight text-white text-sm">Focus Space</span>
            </div>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to cancel the focus session? Progress will not be saved.')) {
                  setIsFocusActive(false)
                  setSessionStartTime(null)
                  setIsTimerRunning(false)
                }
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all active:scale-[0.98]"
            >
              Cancel Focus
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center justify-center md:space-x-16 my-8 md:my-12">
            
            {/* Clock display */}
            <div className="flex flex-col items-center space-y-6 md:w-1/2">
              <div className="text-8xl md:text-[10rem] font-black font-mono tracking-tight text-white select-none">
                {formatTime(timerSeconds)}
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-slate-300 uppercase tracking-wider">{activeCourse}</h3>
                <p className="text-xs text-slate-400 font-medium">{activeChapter} &rarr; {activeLesson}</p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                {isTimerRunning ? (
                  <button 
                    onClick={pauseTimer}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg active:scale-95 transition-all"
                  >
                    <Pause className="h-6 w-6" />
                  </button>
                ) : (
                  <button 
                    onClick={startTimer}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg active:scale-95 transition-all"
                  >
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </button>
                )}
                
                <button 
                  onClick={resetTimer}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 active:scale-95 transition-all"
                >
                  <RotateCcw className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Notes & Checklist Panel */}
            <div className="w-full md:w-1/2 max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 mt-8 md:mt-0">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-400 border-b border-white/10 pb-2">Session Notes & Goals</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Study Objectives</label>
                  <div className="space-y-2 text-xs font-semibold text-slate-300">
                    <label className="flex items-center space-x-2.5">
                      <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-rose-500 focus:ring-0" />
                      <span>Study theory and concept overview</span>
                    </label>
                    <label className="flex items-center space-x-2.5">
                      <input type="checkbox" className="rounded border-white/20 bg-white/5 text-rose-500 focus:ring-0" />
                      <span>Code along with practice challenges</span>
                    </label>
                    <label className="flex items-center space-x-2.5">
                      <input type="checkbox" className="rounded border-white/20 bg-white/5 text-rose-500 focus:ring-0" />
                      <span>Pass topic evaluation quiz</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Write quick summary</label>
                  <textarea
                    value={focusNotes}
                    onChange={(e) => setFocusNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500 transition-colors"
                    placeholder="Document your findings, snippets, or key concepts coverd during this session..."
                  />
                </div>
              </div>

              <button 
                onClick={handleFinishSession}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Complete Study Session & Save
              </button>
            </div>

          </div>

          <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest border-t border-white/10 pt-4">
            Focused State Active &bull; No distractions
          </div>
        </div>
      )}

    </div>
  )
}
