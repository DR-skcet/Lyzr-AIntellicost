"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Bot,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  Target,
  Building,
  Cpu,
  Cloud,
  Star,
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Agent Architect",
      description: "Built with Lyzr Studio - Your personal AI consultant for enterprise cost optimization",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Credit Consumption Analysis",
      description: "Detailed breakdown of Lyzr credits usage and optimization strategies",
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "AWS Bedrock Integration",
      description: "Leverage Claude, Mistral, and Amazon Nova models for cost-efficient AI solutions",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Task Automation Mapping",
      description: "Identify which organizational tasks can be automated to reduce costs and free up resources",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "LLM Selection Engine",
      description: "Balance cost, latency, and quality with Amazon Nova and other cost-efficient models",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Enterprise ROI Calculator",
      description: "Calculate implementation costs, inference costs, and total value of AI deployment",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, FinTech Solutions",
      content:
        "Lyzr Studio's AI Cost Optimizer helped us reduce our AI infrastructure costs by 60% while improving performance. The Amazon Nova recommendations were game-changing.",
      company: "TechFlow",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "AI Director, Legal Corp",
      content:
        "The credit consumption analysis and LLM selection guidance saved us $75K annually. Best investment we made this year.",
      company: "LegalTech Pro",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Head of Operations",
      content:
        "Finally, a tool that understands enterprise AI costs. The task automation mapping identified 40% cost savings opportunities.",
      company: "LogiChain",
      rating: 5,
    },
  ]

  const stats = []

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-black/10 to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Removed: Powered by Lyzr Studio & AWS Bedrock badge */}
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 animate-fade-in mt-32">
              Enterprise AI
              <span className="text-gradient block mt-4">Cost Optimizer</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Your AI Agent Architect built with <span className="text-white font-semibold">Lyzr Studio</span>.
              Optimize costs, select the right LLMs, calculate ROI, and deploy cost-efficient AI agents using
              <span className="text-white font-semibold"> Amazon Nova</span> and{" "}
              <span className="text-white font-semibold">AWS Bedrock</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-black hover:bg-white/10 text-white font-semibold px-8 py-4 text-lg border border-white/20"
                >
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Lyzr Studio Promotion */}
            <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
              <div className="flex items-center justify-center mb-8">
                <Bot className="h-8 w-8 text-white mr-3" />
                <span className="text-2xl font-bold text-white">Built with Lyzr Studio</span>
              </div>
              {/* Removed: Get 500 free Lyzr credits on signup to build your AI cost optimization solution */}
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-white" />
                  Enterprise Security
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-white" />
                  No-Code Agent Builder
                </div>
                <div className="flex items-center">
                  <Cloud className="h-4 w-4 mr-1 text-white" />
                  AWS Bedrock Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 mt-[-48px]">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our <span className="text-gradient">AI Agent Architect?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built with Lyzr Studio to solve enterprise AI cost challenges with precision and intelligence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform border border-white/20">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Removed */}

      {/* Testimonials Section Removed */}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6 mt-[-48px]">
            Ready to Optimize Your <span className="text-gradient">AI Costs?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of enterprises saving millions with Lyzr Studio's AI Cost Optimization Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-black hover:bg-white/10 text-white font-semibold px-8 py-4 text-lg border border-white/20"
              >
                Let's Get Started !
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            Built with <span className="text-white">Lyzr Studio</span> • Powered by{" "}
            <span className="text-white">AWS Bedrock</span> • Optimized with{" "}
            <span className="text-white">Amazon Nova</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bot className="h-8 w-8 text-white mr-2" />
                <span className="text-xl font-bold text-white">Lyzr AIntellicost</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The next-gen enterprise AI cost optimization platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="mailto:support@lyzr.ai" className="hover:text-white transition-colors">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Lyzr AIntellicost. Built with Lyzr Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
