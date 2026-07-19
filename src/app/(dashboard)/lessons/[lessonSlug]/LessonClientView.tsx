'use strict'
'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Play, 
  Pause, 
  Square, 
  ExternalLink, 
  CheckSquare, 
  Square as EmptySquare,
  FileUp,
  Save,
  CheckCircle,
  FileText,
  Clock,
  BookOpen
} from 'lucide-react'

interface LessonClientViewProps {
  lesson: any
  resources: any[]
  tasks: any[]
  initialProgress: any | null
  initialNotes: any[]
  userId: string
}

export default function LessonClientView({
  lesson,
  resources,
  tasks,
  initialProgress,
  initialNotes,
  userId,
}: LessonClientViewProps) {
  const supabase = createClient()

  // State managers
  const [progress, setProgress] = useState<any | null>(initialProgress)
  const [notes, setNotes] = useState<any[]>(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})
  const [reflection, setReflection] = useState(initialProgress?.reflection || '')
  
  // Study Session state
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  
  // File upload state
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const pauseStartRef = useRef<number | null>(null)

  // Timer runner
  useEffect(() => {
    if (sessionActive && !sessionPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [sessionActive, sessionPaused])

  // Study Session Controls
  const startStudySession = async () => {
    setError(null)
    setSeconds(0)
    setBreakMinutes(0)
    setSessionActive(true)
    setSessionPaused(false)

    // Insert new study session
    const { data, error: err } = await supabase
      .from('study_sessions')
      .insert([{
        user_id: userId,
        lesson_id: lesson.id,
        started_at: new Date().toISOString(),
        completed: false,
        device: 'Desktop'
      }])
      .select()

    if (err) setError(err.message)
    else if (data && data[0]) setCurrentSessionId(data[0].id)
  }

  const togglePauseSession = () => {
    if (sessionPaused) {
      // Resumed: calculate break minutes
      if (pauseStartRef.current) {
        const breakMs = Date.now() - pauseStartRef.current
        setBreakMinutes((prev) => prev + Math.floor(breakMs / 60000))
      }
      setSessionPaused(false)
    } else {
      // Paused
      pauseStartRef.current = Date.now()
      setSessionPaused(true)
    }
  }

  const stopStudySession = async () => {
    if (!currentSessionId) return
    setSessionActive(false)
    
    const finalMinutes = Math.max(1, Math.round(seconds / 60))

    const { error: err } = await supabase
      .from('study_sessions')
      .update({
        ended_at: new Date().toISOString(),
        duration_minutes: finalMinutes,
        break_minutes: breakMinutes,
        completed: true,
        notes: `Studied lesson: ${lesson.title}`
      })
      .eq('id', currentSessionId)

    if (err) setError(err.message)
    else {
      // Recalculate study hours on user_progress or daily_progress
      alert(`Study session logged: ${finalMinutes} minutes!`)
    }
  }

  // Handle Note Save
  const handleSaveNote = async () => {
    if (!newNote.trim()) return
    setError(null)

    const { data, error: err } = await supabase
      .from('lesson_notes')
      .insert([{
        lesson_id: lesson.id,
        user_id: userId,
        note: newNote
      }])
      .select()

    if (err) setError(err.message)
    else {
      setNotes([data[0], ...notes])
      setNewNote('')
    }
  }

  // File uploading engine
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const courseSlug = lesson.chapter?.module?.course?.slug || 'general'
      const fileExt = file.name.split('.').pop()
      const fileName = `${lesson.slug}-${taskId}-${Date.now()}.${fileExt}`
      const filePath = `${courseSlug}/${fileName}`

      const { data, error: uploadErr } = await supabase.storage
        .from('practice-images')
        .upload(filePath, file)

      if (uploadErr) throw uploadErr

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('practice-images')
        .getPublicUrl(filePath)

      // Save upload record to practice_uploads
      const { error: dbErr } = await supabase
        .from('practice_uploads')
        .insert([{
          task_id: taskId,
          user_id: userId,
          image_url: publicUrl,
          hours_spent: Math.max(1, Math.round(seconds / 60))
        }])

      if (dbErr) throw dbErr

      setUploadedUrl(publicUrl)
      alert('Upload completed successfully!')
    } catch (err: any) {
      setError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Mark lesson complete
  const markLessonComplete = async () => {
    setError(null)

    const { error: err } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lesson.id,
        status: 'Completed',
        completed_at: new Date().toISOString(),
        reflection: reflection
      }, { onConflict: 'user_id,lesson_id' })

    if (err) setError(err.message)
    else {
      alert('Lesson marked as completed!')
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Lesson Heading banner */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
          <span>{lesson.chapter?.module?.course?.title}</span>
          <span>/</span>
          <span>{lesson.chapter?.title}</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{lesson.title}</h1>
        <div className="flex items-center space-x-4 mt-3 text-xs text-neutral-400 font-medium">
          <span className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{lesson.estimated_minutes} mins</span>
          </span>
          <span className="inline-flex items-center rounded-lg bg-neutral-50 px-2.5 py-0.5 text-xs font-semibold text-neutral-500">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Grid: Study Session Timer & Resources */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Learning Materials & Resources */}
        <div className="md:col-span-2 space-y-6">
          {/* Objectives */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-neutral-900 text-sm mb-4">Learning Objectives</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              {lesson.learning_objectives?.map((obj: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Video or Docs embedded */}
          {(lesson.video_url || lesson.documentation_url) && (
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-neutral-900 text-sm">Media & Documentation</h3>
              <div className="flex flex-col space-y-2">
                {lesson.video_url && (
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    <Play className="h-4 w-4" />
                    <span>Watch Lesson Video</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {lesson.documentation_url && (
                  <a
                    href={lesson.documentation_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Official Documentation</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Resources lists */}
          {resources.length > 0 && (
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-neutral-900 text-sm mb-4">Additional Resources</h3>
              <div className="space-y-3">
                {resources.map((res) => (
                  <div key={res.id} className="flex items-center justify-between rounded-xl bg-neutral-50/50 p-3 border border-neutral-100">
                    <span className="text-sm font-semibold text-neutral-700">{res.title}</span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes manager */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">Personal Notes</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write note or code snippet..."
                className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleSaveNote}
                className="flex items-center space-x-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
            <div className="space-y-2 mt-4 max-h-48 overflow-y-auto divide-y divide-neutral-50">
              {notes.map((note) => (
                <div key={note.id} className="py-2.5 text-sm text-neutral-600">
                  <p>{note.note}</p>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Study Session Timer & Uploads */}
        <div className="space-y-6">
          {/* Study Session Widget */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm">Study Session</h3>
            {sessionActive ? (
              <div className="space-y-4 text-center">
                <div className="text-3xl font-extrabold text-neutral-800 tracking-wider">
                  {Math.floor(seconds / 60)}m {seconds % 60}s
                </div>
                {sessionPaused && (
                  <p className="text-amber-500 text-xs font-semibold uppercase animate-pulse">Session Paused</p>
                )}
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={togglePauseSession}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                  >
                    {sessionPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
                  </button>
                  <button
                    onClick={stopStudySession}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Square className="h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={startStudySession}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Session</span>
              </button>
            )}
          </div>

          {/* Tasks & Practice Upload Checklist */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-neutral-900 text-sm">Tasks & Practice</h3>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-start space-x-2.5">
                    <button
                      onClick={() => setCompletedTasks({
                        ...completedTasks,
                        [task.id]: !completedTasks[task.id]
                      })}
                      className="mt-0.5"
                    >
                      {completedTasks[task.id] ? (
                        <CheckSquare className="h-4.5 w-4.5 text-blue-600" />
                      ) : (
                        <EmptySquare className="h-4.5 w-4.5 text-neutral-400" />
                      )}
                    </button>
                    <span className="text-sm font-medium text-neutral-700">{task.title}</span>
                  </div>

                  {/* If task requires file upload */}
                  {task.upload && (
                    <div className="ml-7 pt-2">
                      <label className="flex items-center space-x-2 rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-semibold text-neutral-500 cursor-pointer hover:bg-neutral-100 transition-colors">
                        <FileUp className="h-4 w-4 text-neutral-400" />
                        <span>{uploading ? 'Uploading...' : 'Upload screenshot/assignment'}</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf,.zip,.txt,.md,.docx"
                          onChange={(e) => handleFileUpload(e, task.id)}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reflection Textarea */}
            <div className="pt-4 border-t border-neutral-50 space-y-2">
              <label className="block text-xs font-semibold text-neutral-600 uppercase">Self Reflection</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you learn today? What was difficult?"
                rows={3}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm text-neutral-900 outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Mark complete button */}
            <button
              onClick={markLessonComplete}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              <CheckCircle className="h-4.5 w-4.5" />
              <span>Mark Lesson Complete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
