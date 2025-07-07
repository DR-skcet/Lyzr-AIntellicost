"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserPlus, Lock, Mail } from "lucide-react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setLoading(false)
      router.push("/signin") // Redirect to sign in after successful signup
    } catch (err: any) {
      setError(err.message || "Failed to sign up.")
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/")
    } catch (err) {
      setError("Google sign up failed.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-spin-slow" />
      </div>
      <div className="w-full max-w-md p-10 rounded-3xl glass-effect border border-white/20 shadow-2xl animate-fade-in bg-black/90 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <UserPlus className="h-12 w-12 text-white mb-2 animate-bounce" />
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-gray-400 mt-1 text-base">Sign up to get started</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-7">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-white/70" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/70 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 text-base transition-all"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/70 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 text-base transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Password"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-white/70" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/70 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400 text-base transition-all"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
          </div>
          {/* Password strength meter */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                password.length > 8 ? "bg-white w-5/6" : password.length > 4 ? "bg-white/70 w-1/2" : password.length > 0 ? "bg-white/40 w-1/4" : "w-0"
              }`}
            />
          </div>
          {/* Terms and conditions */}
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <input type="checkbox" required className="accent-white w-4 h-4" id="terms" />
            <label htmlFor="terms">I agree to the <a href="#" className="underline hover:text-white">Terms & Conditions</a></label>
          </div>
          {error && <div className="text-red-400 text-sm text-center animate-pulse font-semibold">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 border border-white/20 text-lg tracking-wide"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <div className="flex flex-col items-center mt-8 gap-2">
          <Link href="/signin" className="text-white hover:underline text-base font-medium">Already have an account? <span className="font-bold">Sign In</span></Link>
          <div className="flex flex-col items-center gap-2 mt-2 w-full">
            <span className="text-gray-400 text-xs mb-1">or</span>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center w-full border border-black bg-white text-black font-medium rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black/30 gap-3"
              style={{ minHeight: 44 }}
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
              <span className="text-base font-semibold">Sign up with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
