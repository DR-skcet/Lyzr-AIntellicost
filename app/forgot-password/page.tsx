"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setMessage("Password reset email sent! Check your inbox.")
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-2xl glass-effect border-4 border-white shadow-2xl animate-fade-in bg-black/80">
        <div className="flex flex-col items-center mb-6">
          <Mail className="h-10 w-10 text-white mb-2 animate-bounce" />
          <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
          <p className="text-gray-400 mt-1 text-center">Enter your email to receive a password reset link.</p>
        </div>
        <form onSubmit={handleReset} className="space-y-6">
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
          {message && <div className="text-green-400 text-sm text-center animate-pulse">{message}</div>}
          {error && <div className="text-red-400 text-sm text-center animate-pulse">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-200 border border-white/20"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-6">
          <Link href="/signin" className="text-white hover:underline text-sm">Back to Sign In</Link>
        </div>
      </div>
    </div>
  )
}
