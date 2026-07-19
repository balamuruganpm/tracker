'use strict'
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit2, ChevronRight, Folder, FolderOpen, FileText, Settings, Database, Upload } from 'lucide-react'

export default function AdminCurriculumClient() {
  const supabase = createClient()

  // State lists
  const [courses, setCourses] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [chapters, setChapters] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])

  // Selection states
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null)
  const [selectedModule, setSelectedModule] = useState<any | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null)

  // Edit / Add modal form state
  const [activeTab, setActiveTab] = useState<'editor' | 'bulk'>('editor')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch initial courses
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('courses')
      .select('*')
      .order('order', { ascending: true })
    if (err) setError(err.message)
    else setCourses(data || [])
    setLoading(false)
  }

  // Fetch modules when course selection changes
  useEffect(() => {
    if (selectedCourse) {
      fetchModules(selectedCourse.id)
      setSelectedModule(null)
      setSelectedChapter(null)
      setSelectedLesson(null)
      setModules([])
      setChapters([])
      setLessons([])
    }
  }, [selectedCourse])

  const fetchModules = async (courseId: string) => {
    const { data, error: err } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true })
    if (err) setError(err.message)
    else setModules(data || [])
  }

  // Fetch chapters when module selection changes
  useEffect(() => {
    if (selectedModule) {
      fetchChapters(selectedModule.id)
      setSelectedChapter(null)
      setSelectedLesson(null)
      setChapters([])
      setLessons([])
    }
  }, [selectedModule])

  const fetchChapters = async (moduleId: string) => {
    const { data, error: err } = await supabase
      .from('chapters')
      .select('*')
      .eq('module_id', moduleId)
      .order('order', { ascending: true })
    if (err) setError(err.message)
    else setChapters(data || [])
  }

  // Fetch lessons when chapter selection changes
  useEffect(() => {
    if (selectedChapter) {
      fetchLessons(selectedChapter.id)
      setSelectedLesson(null)
      setLessons([])
    }
  }, [selectedChapter])

  const fetchLessons = async (chapterId: string) => {
    const { data, error: err } = await supabase
      .from('lessons')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order', { ascending: true })
    if (err) setError(err.message)
    else setLessons(data || [])
  }

  // Fetch tasks and resources when lesson selection changes
  useEffect(() => {
    if (selectedLesson) {
      fetchTasks(selectedLesson.id)
      fetchResources(selectedLesson.id)
    }
  }, [selectedLesson])

  const fetchTasks = async (lessonId: string) => {
    const { data, error: err } = await supabase
      .from('tasks')
      .select('*')
      .eq('lesson_id', lessonId)
    if (err) setError(err.message)
    else setTasks(data || [])
  }

  const fetchResources = async (lessonId: string) => {
    const { data, error: err } = await supabase
      .from('resources')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true })
    if (err) setError(err.message)
    else setResources(data || [])
  }

  // Quick Inline additions
  const handleAddCourse = async () => {
    const title = prompt('Enter Course Title:')
    if (!title) return
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { data, error: err } = await supabase
      .from('courses')
      .insert([{ title, slug, difficulty: 'Beginner', order: courses.length }])
      .select()
    if (err) setError(err.message)
    else {
      setCourses([...courses, data[0]])
      setSelectedCourse(data[0])
    }
  }

  const handleAddModule = async () => {
    if (!selectedCourse) return
    const title = prompt('Enter Module Title:')
    if (!title) return
    const { data, error: err } = await supabase
      .from('modules')
      .insert([{ course_id: selectedCourse.id, title, order: modules.length }])
      .select()
    if (err) setError(err.message)
    else {
      setModules([...modules, data[0]])
      setSelectedModule(data[0])
    }
  }

  const handleAddChapter = async () => {
    if (!selectedModule) return
    const title = prompt('Enter Chapter Title:')
    if (!title) return
    const { data, error: err } = await supabase
      .from('chapters')
      .insert([{ module_id: selectedModule.id, title, order: chapters.length }])
      .select()
    if (err) setError(err.message)
    else {
      setChapters([...chapters, data[0]])
      setSelectedChapter(data[0])
    }
  }

  const handleAddLesson = async () => {
    if (!selectedChapter) return
    const title = prompt('Enter Lesson Title:')
    if (!title) return
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const { data, error: err } = await supabase
      .from('lessons')
      .insert([{ chapter_id: selectedChapter.id, title, slug, difficulty: 'Beginner', order: lessons.length }])
      .select()
    if (err) setError(err.message)
    else {
      setLessons([...lessons, data[0]])
      setSelectedLesson(data[0])
    }
  }

  const handleAddTask = async () => {
    if (!selectedLesson) return
    const title = prompt('Enter Task Title:')
    if (!title) return
    const { data, error: err } = await supabase
      .from('tasks')
      .insert([{ lesson_id: selectedLesson.id, title, task_type: 'practice' }])
      .select()
    if (err) setError(err.message)
    else setTasks([...tasks, data[0]])
  }

  // Deletions
  const handleDelete = async (table: string, id: string, refreshCallback: () => void) => {
    if (!confirm('Are you sure you want to delete this?')) return
    const { error: err } = await supabase.from(table).delete().eq('id', id)
    if (err) setError(err.message)
    else refreshCallback()
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-red-800 hover:text-red-950">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-100">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center space-x-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'editor'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Curriculum Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center space-x-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'bulk'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Bulk Operations</span>
        </button>
      </div>

      {activeTab === 'editor' ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Tree Navigation Pane */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-neutral-900">Courses</h3>
                <button
                  onClick={handleAddCourse}
                  className="flex items-center space-x-1 rounded-lg bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-1">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      selectedCourse?.id === course.id
                        ? 'bg-blue-50/70 text-blue-600'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="truncate">{course.title}</span>
                    <ChevronRight className="h-4 w-4 opacity-55" />
                  </button>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <div>
                <div className="flex items-center justify-between mb-4 border-t border-neutral-50 pt-4">
                  <h3 className="font-bold text-neutral-900">Modules</h3>
                  <button
                    onClick={handleAddModule}
                    className="flex items-center space-x-1 rounded-lg bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-1">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModule(mod)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                        selectedModule?.id === mod.id
                          ? 'bg-blue-50/70 text-blue-600'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="truncate">{mod.title}</span>
                      <ChevronRight className="h-4 w-4 opacity-55" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedModule && (
              <div>
                <div className="flex items-center justify-between mb-4 border-t border-neutral-50 pt-4">
                  <h3 className="font-bold text-neutral-900">Chapters</h3>
                  <button
                    onClick={handleAddChapter}
                    className="flex items-center space-x-1 rounded-lg bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                <div className="space-y-1">
                  {chapters.map((chap) => (
                    <button
                      key={chap.id}
                      onClick={() => setSelectedChapter(chap)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                        selectedChapter?.id === chap.id
                          ? 'bg-blue-50/70 text-blue-600'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="truncate">{chap.title}</span>
                      <ChevronRight className="h-4 w-4 opacity-55" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chapters & Lessons view */}
          <div className="md:col-span-2 space-y-6">
            {selectedChapter ? (
              <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Lessons list</span>
                    <h2 className="text-xl font-bold text-neutral-900 mt-1">{selectedChapter.title}</h2>
                  </div>
                  <button
                    onClick={handleAddLesson}
                    className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                        selectedLesson?.id === lesson.id
                          ? 'border-blue-200 bg-blue-50/20'
                          : 'border-neutral-100 hover:border-neutral-200 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="flex flex-1 items-center space-x-3 text-left font-semibold text-neutral-800"
                      >
                        <FileText className="h-5 w-5 text-neutral-400" />
                        <span>{lesson.title}</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete('lessons', lesson.id, () => fetchLessons(selectedChapter.id))}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <FolderOpen className="h-10 w-10 text-neutral-300 mb-4" />
                <h3 className="font-bold text-neutral-800">No Chapter Selected</h3>
                <p className="text-neutral-500 text-sm mt-1">Select a course, module, and chapter to manage lessons.</p>
              </div>
            )}

            {/* Lesson details & tasks list */}
            {selectedLesson && (
              <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Tasks & Practice for "{selectedLesson.title}"</h3>
                  <p className="text-neutral-500 text-xs mt-1">Add objective criteria, practices, and resources.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
                    <h4 className="font-semibold text-neutral-800 text-sm">Tasks</h4>
                    <button
                      onClick={handleAddTask}
                      className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-xl border border-neutral-50 bg-neutral-50/20 px-4 py-3">
                      <span className="text-sm font-medium text-neutral-700">{task.title}</span>
                      <button
                        onClick={() => handleDelete('tasks', task.id, () => fetchTasks(selectedLesson.id))}
                        className="text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm max-w-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Seeding Options</h3>
            <p className="text-neutral-500 text-sm mt-1">Populate or reset the database schemas.</p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start space-x-3">
            <Database className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              Before populating, confirm the engine components are active. Seeding curriculum outlines can be executed during Phase 3.
            </div>
          </div>
          <button
            onClick={async () => {
              setLoading(true)
              setError(null)
              try {
                const res = await fetch('/api/admin/seed', { method: 'POST' })
                const data = await res.json()
                if (data.error) throw new Error(data.error)
                alert('Curriculum seeded successfully!')
                fetchCourses()
              } catch (err: any) {
                setError(err.message)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>{loading ? 'Seeding...' : 'Seed Curriculum Outline'}</span>
          </button>
        </div>
      )}
    </div>
  )
}
