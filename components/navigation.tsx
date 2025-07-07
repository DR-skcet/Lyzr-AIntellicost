"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { User } from "firebase/auth"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const handleDemoClick = () => {
    window.open("https://calendly.com/lyzr-demo", "_blank")
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">Lyzr AIntellicost</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/#features"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDemoClick}
                className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
              >
                Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLyzrStudioClick}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
              >
                Lyzr Studio
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
              <Link href="/dashboard">
                <Button size="sm" className="lyzr-gradient hover:opacity-90 text-white">
                  Dashboard
                </Button>
              </Link>
              {user ? (
                <div className="relative group">
                  <Button
                    size="sm"
                    className="bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                  className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  LogIn / Sign Up
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-effect border-t border-purple-500/20">
            <Link
              href="/#features"
              className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleDemoClick()
                setIsMenuOpen(false)
              }}
              className="w-full justify-start text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
            >
              Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleLyzrStudioClick()
                setIsMenuOpen(false)
              }}
              className="w-full justify-start border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              Lyzr Studio
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
            <Link href="/dashboard" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
              <Button size="sm" className="w-full lyzr-gradient hover:opacity-90 text-white">
                Dashboard
              </Button>
            </Link>
            {user ? (
              <div className="mt-2 relative group">
                <Button
                  size="sm"
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </span>
                  <span className="ml-2">{user.email}</span>
                  <svg className="ml-2 w-4 h-4 text-white group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-white/20 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-200 z-50">
                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false) }}
                    className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                className="text-gray-300 hover:text-purple-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
