"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  FileText,
  Settings,
  Users,
  Menu,
  Home,
  TrendingUp,
  DollarSign,
  Bell,
  ExternalLink,
  Sparkles,
  Target,
  Building,
  Cpu,
  Cloud,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "AI Cost Optimization", href: "/dashboard", icon: Home },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

import type { User } from "firebase/auth"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut(auth)
  }

  const handleLyzrStudioClick = () => {
    window.open("https://studio.lyzr.ai", "_blank")
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full bg-black/90", mobile ? "w-full" : "w-64")}> 
      <Link href="/" className="flex items-center h-16 px-4 border-b border-white/10 hover:opacity-80 transition-opacity">
        <Bot className="h-8 w-8 text-white" />
        <span className="ml-2 text-xl font-bold text-white">AIntellicost</span>
      </Link>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-transparent",
                isActive
                  ? "bg-white text-black border-white shadow"
                  : "text-white hover:bg-white/10 hover:text-black",
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-purple-500/20">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-black border-purple-500/20">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-black/90 border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">

              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Removed Enterprise Plan badge */}
            </div>

            <div className="flex items-center space-x-4">
              {/* Removed notification bell as it is non-functional */}
              {/* Removed Lyzr Studio button for minimalism */}
              {user ? (
                <div className="relative group">
                  <Button
                    size="sm"
                    className="bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="inline-block w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </span>
                    <span className="hidden md:inline">{user.email}</span>
                    <svg className="ml-2 w-4 h-4 text-white group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-white/20 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-200 z-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  LogIn / Sign Up
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-black">
          {children}
        </main>
      </div>
    </div>
  )
}
