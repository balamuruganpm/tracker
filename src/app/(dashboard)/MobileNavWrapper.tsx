'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  LogOut,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Award,
  Landmark,
  Calendar,
  BookText,
  Heart,
  TrendingUp,
  User,
  ShieldAlert
} from 'lucide-react'

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
}

interface MobileNavWrapperProps {
  userName: string
  userRole: string
  navLinks: NavLink[]
}

export default function MobileNavWrapper({ userName, userRole, navLinks }: MobileNavWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Bottom Navigation links
  const bottomNavItemsLeft = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/courses', label: 'Learning', icon: <BookOpen className="h-5 w-5" /> },
  ]

  const bottomNavItemsRight = [
    { href: '/projects', label: 'Projects', icon: <Briefcase className="h-5 w-5" /> },
    { href: '/analytics', label: 'Analytics', icon: <TrendingUp className="h-5 w-5" /> },
  ]

  const triggerFocusTimer = () => {
    window.dispatchEvent(new CustomEvent('open-focus-timer'))
  }

  return (
    <>
      {/* Sticky Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/70 backdrop-blur-xl px-6 md:hidden">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/10 flex items-center justify-center">
            <span className="text-[10px] font-black text-white">730</span>
          </div>
          <span className="font-bold tracking-tight text-slate-900 text-sm">Project 730</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/profile" className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
            {userName[0].toUpperCase()}
          </Link>
          <button 
            onClick={() => setIsOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Slide-out Full Navigation Drawer (backdrop + panel) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl transition-transform duration-350 ease-out">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">730</span>
                </div>
                <span className="font-bold text-slate-900 text-sm">Project 730</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Links List */}
            <nav className="flex-1 space-y-1 overflow-y-auto py-6 pr-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Drawer Footer / User Profile */}
            <div className="border-t border-slate-50 pt-6">
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
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar with Floating Core Trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 backdrop-blur-xl px-2 py-2 md:hidden shadow-lg flex items-center justify-around h-16">
        <div className="flex w-2/5 justify-around">
          {bottomNavItemsLeft.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 transition-all duration-200 ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {item.icon}
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Center Floating Focus Action button */}
        <button
          onClick={triggerFocusTimer}
          className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-none ring-4 ring-white"
          title="Start Focus Session"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        <div className="flex w-2/5 justify-around">
          {bottomNavItemsRight.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 transition-all duration-200 ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                {item.icon}
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
