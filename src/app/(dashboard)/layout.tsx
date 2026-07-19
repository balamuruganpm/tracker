import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  LayoutDashboard, 
  BookOpen, 
  Compass, 
  Briefcase, 
  Award, 
  Landmark, 
  Calendar, 
  BookText, 
  Heart, 
  User, 
  ShieldAlert,
  LogOut,
  TrendingUp
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
    { href: '/courses', label: 'Learning Roadmap', icon: <BookOpen className="h-5 w-5" /> },
    { href: '/projects', label: 'Projects', icon: <Briefcase className="h-5 w-5" /> },
    { href: '/certificates', label: 'Certificates', icon: <Award className="h-5 w-5" /> },
    { href: '/finance', label: 'Finance', icon: <Landmark className="h-5 w-5" /> },
    { href: '/timeline', label: 'Timeline', icon: <Calendar className="h-5 w-5" /> },
    { href: '/journal', label: 'Journal', icon: <BookText className="h-5 w-5" /> },
    { href: '/journey-together', label: 'Journey Together', icon: <Heart className="h-5 w-5" /> },
    { href: '/reports', label: 'Reports', icon: <TrendingUp className="h-5 w-5" /> },
    { href: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ]

  if (userRole === 'Admin') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: <ShieldAlert className="h-5 w-5" /> })
  }

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] font-sans antialiased text-neutral-800">
      {/* Sidebar for Desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-neutral-100 bg-white p-6 md:flex">
        {/* Brand */}
        <div className="mb-8 flex items-center space-x-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600"></div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">Project 730</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile Summary */}
        <div className="mt-auto border-t border-neutral-100 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-600">
              {userName[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{userName}</p>
              <p className="text-xs text-neutral-400 font-medium">{userRole}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* Header (Mobile Navigation Toggle placeholder) */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-100 bg-white/80 backdrop-blur-md px-6 md:hidden">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600"></div>
            <span className="font-bold tracking-tight text-neutral-900">Project 730</span>
          </div>
          {/* Mobile Profile Link */}
          <Link href="/profile" className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 text-xs">
            {userName[0].toUpperCase()}
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
