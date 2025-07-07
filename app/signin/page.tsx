"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setLoading(false);
      router.push("/");
    } catch (err) {
      setError("Google sign in failed.");
      setLoading(false);
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)
      router.push("/") // Redirect to home after successful login
    } catch (err: any) {
      setError(err.message || "Failed to sign in.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-2xl glass-effect border-4 border-white shadow-2xl animate-fade-in bg-black/80">
        <div className="flex flex-col items-center mb-6">
          <Bot className="h-10 w-10 text-white mb-2 animate-bounce" />
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-white/70" />
            <input
              type="email"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-white/70" />
            <input
              type="password"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>
          {error && <div className="text-red-400 text-sm text-center animate-pulse">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-200 border border-white/20"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="flex flex-col items-center gap-2 mt-6 w-full">
          <span className="text-gray-400 text-xs mb-1">or</span>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full border border-black bg-white text-black font-medium rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black/30 gap-3"
            style={{ minHeight: 44 }}
            disabled={loading}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" className="mr-2" aria-hidden="true">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.07 1.53 7.47 2.81l5.52-5.36C33.6 3.7 29.2 1.5 24 1.5 14.98 1.5 7.13 7.7 4.13 15.19l6.77 5.26C12.5 15.13 17.77 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.59C43.87 37.13 46.1 31.36 46.1 24.55z"/>
                <path fill="#FBBC05" d="M10.9 28.45c-1.04-3.09-1.04-6.41 0-9.5l-6.77-5.26C1.64 17.36 0 20.55 0 24s1.64 6.64 4.13 9.31l6.77-5.26z"/>
                <path fill="#EA4335" d="M24 46.5c5.2 0 9.6-1.73 12.8-4.7l-7.18-5.59c-2 1.36-4.56 2.19-7.62 2.19-6.23 0-11.5-5.63-12.97-12.95l-6.77 5.26C7.13 40.3 14.98 46.5 24 46.5z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            <span className="text-base font-semibold">Sign in with Google</span>
          </button>
        </div>
        <div className="flex justify-between items-center mt-6">
          <Link href="/signup" className="text-white hover:underline text-sm">Don't have an account? Sign Up</Link>
          <Link href="/forgot-password" className="text-gray-400 hover:text-white text-xs">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}
