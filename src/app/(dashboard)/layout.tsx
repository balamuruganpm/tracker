import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MobileNavWrapper from './MobileNavWrapper'
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Award, 
  BarChart2, 
  Settings, 
  ShieldAlert,
  LogOut,
  Heart,
  MessageCircle
} from 'lucide-react'

interface NavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile and role
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, photo_url, roles(name)')
    .eq('id', user.id)
    .single()

  const userRole = (profile?.roles as any)?.name || 'Viewer'
  const userName = profile?.name || user.email?.split('@')[0] || 'User'

  const navLinks: NavLinkProps[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/courses', label: 'Learning', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/projects', label: 'Projects', icon: <Briefcase className="h-5 w-5" /> },
    { href: '/certificates', label: 'Certificates', icon: <Award className="h-5 w-5" /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { href: '/important-dates', label: 'Our Moments', icon: <Heart className="h-5 w-5" /> },
    { href: '/chat', label: 'Our Chat', icon: <MessageCircle className="h-5 w-5" /> },
    { href: '/profile', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ]

  if (userRole === 'Admin') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: <ShieldAlert className="h-5 w-5" /> })
  }

  // Calculate elapsed days
  const startDate = new Date('2026-07-20T00:00:00')
  const elapsed = Date.now() - startDate.getTime()
  const elapsedDays = Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)))
  const remainingDays = Math.max(0, 730 - elapsedDays)

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-100 bg-white p-6 md:flex">
        {/* Brand */}
        <div className="mb-8 flex flex-col">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 flex items-center justify-center font-bold text-white text-xs">730</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Project 730</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 ml-0.5">Focus. Learn. Grow.</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Progress Counter card inside sidebar bottom */}
        <div className="mb-6 rounded-2xl bg-slate-50/80 border border-slate-100 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
            <span>Days Remaining</span>
            <span className="text-blue-600 font-mono">{remainingDays} days</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(elapsedDays / 730) * 100}%` }}></div>
          </div>
          <p className="text-[10px] font-semibold text-slate-400">Keep going! 💪</p>
        </div>

        {/* User Profile Summary */}
        <div className="mt-auto border-t border-slate-100 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
              {userName[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-400 font-medium">{userRole}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Dynamic Mobile Header, Bottom Bar, & Drawer */}
        <MobileNavWrapper userName={userName} userRole={userRole} navLinks={navLinks} />

        {/* Page Content */}
        <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full pb-24 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  )
}
