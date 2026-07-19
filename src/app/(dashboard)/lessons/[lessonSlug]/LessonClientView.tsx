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

function RichLessonContent({ content }: { content: string }) {
  const [openQA, setOpenQA] = useState<Record<string, boolean>>({})
  const [showQuizAnswers, setShowQuizAnswers] = useState(false)

  if (!content) return null

  // Parser
  const lines = content.split('\n')
  const sections: { type: string; title: string; items: string[] }[] = []
  let currentSection: { type: string; title: string; items: string[] } | null = null

  const headerKeywords = [
    'topics', 'theory', 'example', 'where javascript runs', 
    'what can javascript do', 'browser javascript', 'node.js', 
    'javascript engine', 'v8 engine', 'javascript runtime',
    'ecmascript', 'applications', 'quick notes', 'interview questions', 
    'practice questions', 'assignment', 'mini quiz'
  ]

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return

    const lowerTrimmed = trimmed.toLowerCase().replace('## ', '')
    const isHeader = trimmed.startsWith('## ') || headerKeywords.some(keyword => lowerTrimmed === keyword)

    if (isHeader) {
      const title = trimmed.replace('## ', '')
      let type = 'general'
      if (title.toLowerCase().includes('interview')) type = 'qa'
      else if (title.toLowerCase().includes('practice')) type = 'practice'
      else if (title.toLowerCase().includes('quiz')) type = 'quiz'
      else if (title.toLowerCase().includes('assignment')) type = 'assignment'
      else if (title.toLowerCase().includes('quick notes') || title.toLowerCase().includes('note')) type = 'note'
      else if (title.toLowerCase().includes('example') || title.toLowerCase().includes('html')) type = 'example'
      else if (title.toLowerCase().includes('topics')) type = 'topics'
      
      currentSection = { type, title, items: [] }
      sections.push(currentSection)
    } else {
      if (!currentSection) {
        currentSection = { type: 'general', title: 'Introduction', items: [] }
        sections.push(currentSection)
      }
      currentSection.items.push(trimmed)
    }
  })

  return (
    <div className="space-y-6">
      {sections.map((section, sIdx) => {
        if (section.type === 'topics') {
          return (
            <div key={sIdx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                {section.title}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50/50 rounded-lg p-2.5 border border-slate-100/50">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{item.replace(/^[✓\s*-\s]+/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (section.type === 'qa') {
          return (
            <div key={sIdx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">{section.title}</h3>
              <div className="space-y-3">
                {section.items.map((item, i) => {
                  if (item.startsWith('Q')) {
                    const id = `${sIdx}-${i}`
                    const answer = section.items[i + 1] || ''
                    return (
                      <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenQA(prev => ({ ...prev, [id]: !prev[id] }))}
                          className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-700 bg-slate-50/30 hover:bg-slate-50 transition-colors"
                        >
                          <span>{item}</span>
                          <span className="text-xs text-blue-600 font-bold">{openQA[id] ? 'Hide Answer' : 'Show Answer'}</span>
                        </button>
                        {openQA[id] && (
                          <div className="p-4 text-xs font-semibold leading-relaxed text-slate-600 border-t border-slate-100 bg-white">
                            {answer.replace('Answer: ', '')}
                          </div>
                        )}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )
        }

        if (section.type === 'quiz') {
          return (
            <div key={sIdx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">{section.title}</h3>
                <button
                  onClick={() => setShowQuizAnswers(!showQuizAnswers)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showQuizAnswers ? 'Hide Answers' : 'Reveal Answers'}
                </button>
              </div>
              <div className="space-y-3 text-xs font-semibold text-slate-600">
                {section.items.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 space-y-2">
                    <p className="font-bold text-slate-800">{item}</p>
                    {showQuizAnswers && (
                      <p className="text-emerald-600 font-bold uppercase tracking-wider text-[9px] mt-1">&rarr; Answer key active</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return (
          <div key={sIdx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">{section.title}</h3>
            <div className="text-xs font-semibold leading-relaxed text-slate-600 space-y-2">
              {section.items.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
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
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [reflection, setReflection] = useState(initialProgress?.reflection || '')
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState<any[]>(initialNotes)
  const [error, setError] = useState<string | null>(null)

  // Timer states
  const [seconds, setSeconds] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionPaused, setSessionPaused] = useState(false)
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const timerRef = useRef<any>(null)
  const pauseStartRef = useRef<number | null>(null)

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
      if (pauseStartRef.current) {
        const breakMs = Date.now() - pauseStartRef.current
        setBreakMinutes((prev) => prev + Math.floor(breakMs / 60000))
      }
      setSessionPaused(false)
    } else {
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

      const { data: { publicUrl } } = supabase.storage
        .from('practice-images')
        .getPublicUrl(filePath)

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
    <div className="space-y-6 px-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Lesson Header Banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          <span>{lesson.chapter?.module?.course?.title}</span>
          <span>/</span>
          <span>{lesson.chapter?.title}</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{lesson.title}</h1>
        <div className="flex items-center space-x-4 mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{lesson.estimated_minutes} mins</span>
          </span>
          <span className="inline-flex items-center rounded-lg bg-slate-50 px-2 py-0.5 border border-slate-100">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Grid Layout: Left Content, Right Sticky Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column - Lesson Materials */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Objectives */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Learning Objectives</h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              {lesson.learning_objectives?.map((obj: string, i: number) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <RichLessonContent content={lesson.description} />

          {/* Video or Docs embedded */}
          {(lesson.video_url || lesson.documentation_url) && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Media & Documentation</h3>
              <div className="flex flex-col space-y-2.5 text-xs font-semibold">
                {lesson.video_url && (
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:underline"
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
                    className="flex items-center space-x-2 text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Official Documentation</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes manager */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Study Notes</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write code snippet or note..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSaveNote}
                className="flex items-center space-x-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
            <div className="space-y-2 mt-4 max-h-48 overflow-y-auto divide-y divide-slate-50">
              {notes.map((note) => (
                <div key={note.id} className="py-2.5 text-xs font-semibold text-slate-600">
                  <p className="text-slate-800">{note.note}</p>
                  <span className="text-[9px] text-slate-400 font-bold mt-1 block">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Study Session & Checklist */}
        <div className="space-y-6">
          
          {/* Study Session Widget */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Study Session Timer</h3>
            {sessionActive ? (
              <div className="space-y-4 text-center">
                <div className="text-2xl font-extrabold text-slate-800 tracking-wider font-mono">
                  {Math.floor(seconds / 60)}m {seconds % 60}s
                </div>
                {sessionPaused && (
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-wider animate-pulse">Session Paused</p>
                )}
                <div className="flex justify-center space-x-3">
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
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Study Session</span>
              </button>
            )}
          </div>

          {/* Tasks & Practice Upload Checklist */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Tasks & Uploads</h3>
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
                        <EmptySquare className="h-4.5 w-4.5 text-slate-400" />
                      )}
                    </button>
                    <span className="text-xs font-semibold text-slate-700 leading-normal">{task.title}</span>
                  </div>

                  {task.upload && (
                    <div className="ml-7 pt-2">
                      <label className="flex items-center space-x-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2 text-[10px] font-bold text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
                        <FileUp className="h-4 w-4 text-slate-400" />
                        <span>{uploading ? 'Uploading...' : 'Upload screenshot'}</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf,.zip"
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

            {/* Resources list */}
            {resources.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-50">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Downloads & Resources</span>
                <div className="space-y-2 text-xs font-semibold">
                  {resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between text-blue-600 hover:underline"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reflection Textarea */}
            <div className="pt-4 border-t border-slate-50 space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Self Reflection</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you learn? What was difficult?"
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Mark complete button */}
            <button
              onClick={markLessonComplete}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-green-700 transition-all active:scale-[0.98]"
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
