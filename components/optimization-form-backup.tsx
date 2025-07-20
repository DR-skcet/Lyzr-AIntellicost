"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, Mail, Eye, EyeOff, TrendingUp, DollarSign, Zap, Target, Award, BarChart3, CheckCircle2, AlertTriangle, Info } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const suggestedUseCases = {
  Fintech: "Summarize transactions, generate reports, multilingual chatbot",
  Legal: "Contract analysis, legal document QA",
  Logistics: "Track shipments, delivery report summarization, image-based note classification",
}

const awsBedrockModels = [
  {
    name: "Amazon Nova Pro",
    cost: "$0.80/1M input tokens",
    strengths: "Multimodal, cost-effective, general purpose",
    useCase: "Most enterprise tasks, document analysis",
    creditConsumption: "Low",
  },
  {
    name: "Amazon Nova Lite",
    cost: "$0.06/1M input tokens",
    strengths: "Ultra low-cost, fast inference",
    useCase: "Simple classification, basic QA",
    creditConsumption: "Very Low",
  },
  {
    name: "Claude 3.5 Sonnet",
    cost: "$3.00/1M input tokens",
    strengths: "Advanced reasoning, code generation",
    useCase: "Complex analysis, technical tasks",
    creditConsumption: "Medium",
  },
  {
    name: "Claude 3 Haiku",
    cost: "$0.25/1M input tokens",
    strengths: "Fast, efficient, good quality",
    useCase: "Customer support, content moderation",
    creditConsumption: "Low",
  },
  {
    name: "Mistral Large",
    cost: "$4.00/1M input tokens",
    strengths: "Multilingual, reasoning",
    useCase: "Global operations, complex reasoning",
    creditConsumption: "High",
  },
]

interface FormData {
  domain: string
  useCase: string
  teamSize: number
  budget: number
  priority: string
  infrastructure: string
  email: string
  sendEmail: boolean
  monthlyVolume: number
  currentModels: string[]
  organizationalFunctions: string[]
  generatePdf: boolean // NEW
}

interface AnalysisResult {
  response: string
  executiveSummary?: string
  recommendations?: Array<{
    model: string
    cost: string
    reasoning: string
    priority: number
  }>
  costBreakdown?: {
    current: number
    optimized: number
    savings: number
    savingsPercentage: number
  }
  implementation?: {
    timeline: string
    steps: string[]
    risks: string[]
  }
  roi?: {
    months: number
    percentage: number
    annual: number
  }
}


export default function OptimizationForm() {
  const [formData, setFormData] = useState<FormData>({
    domain: "Fintech",
    useCase: suggestedUseCases["Fintech"],
    teamSize: 10,
    budget: 100,
    priority: "cost",
    infrastructure: "AWS",
    email: "",
    sendEmail: false,
    monthlyVolume: 100000,
    currentModels: [],
    organizationalFunctions: [],
    generatePdf: false, // NEW
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [showRaw, setShowRaw] = useState(false)

  // Function to extract key metrics from the response
  const extractKeyMetrics = (response: string) => {
    const metrics = {
      recommendedModel: "Nova Lite",
      roi: "220%",
      breakeven: "5 weeks",
      costRange: "$18-24"
    };

    try {
      // Extract ROI
      const roiMatch = response.match(/ROI[^|]*\|\s*([^|]+)/i);
      if (roiMatch) metrics.roi = roiMatch[1].trim();

      // Extract break-even
      const breakEvenMatch = response.match(/Break-even[^|]*\|\s*([^|]+)/i);
      if (breakEvenMatch) metrics.breakeven = breakEvenMatch[1].trim();

      // Extract recommended models (look for Nova Lite or Mistral Small)
      if (response.includes('Nova Lite')) {
        metrics.recommendedModel = 'Nova Lite';
      } else if (response.includes('Mistral Small')) {
        metrics.recommendedModel = 'Mistral Small';
      }

      // Extract cost range from token cost table
      const costMatches = response.match(/\$[\d.]+/g);
      if (costMatches && costMatches.length >= 2) {
        const minCost = Math.min(...costMatches.map(c => parseFloat(c.replace('$', ''))));
        const maxCost = Math.max(...costMatches.map(c => parseFloat(c.replace('$', ''))));
        metrics.costRange = `$${minCost}-${maxCost}`;
      }
    } catch (error) {
      console.log('Error extracting metrics:', error);
    }

    return metrics;
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    setProgress(0)
    setResult(null)
    
    try {
      setProgress(20)
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setProgress(60)
      if (!response.ok) throw new Error("Failed to generate report")
      const data = await response.json()
      setProgress(100)
      setResult(data)
      
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const response = await fetch("/api/optimize?pdf=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to download PDF")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "AI-Cost-Optimization-Report.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("PDF download failed:", error)
    }
  }

  const ReportSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )

  const MetricCard = ({ title, value, subtitle, trend }: { title: string, value: string, subtitle?: string, trend?: 'up' | 'down' }) => (
    <div className="group bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-lg p-5 border border-gray-600/50 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/10 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-300 font-semibold tracking-wide uppercase">{title}</p>
        {trend && (
          <div className="p-1 rounded-full bg-emerald-500/20">
            <TrendingUp className={`h-3 w-3 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'} ${trend === 'down' ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-white mb-2 group-hover:text-emerald-300 transition-colors">{value}</p>
      {subtitle && <p className="text-sm text-gray-400 font-medium">{subtitle}</p>}
      <div className="mt-3 h-1 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </div>
  )

  // Add options for organizational functions
  const orgFunctionOptions = [
    "HR", "Finance", "Support", "Sales", "Operations", "IT", "Legal", "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400/30 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-400/40 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-cyan-400/20 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-300/50 rounded-full animate-pulse delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-teal-300/30 rounded-full animate-ping delay-1500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-4 animate-pulse">
              AIntellicost
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-2xl text-white font-semibold mb-3">Enterprise AI Cost Optimization Advisor</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get instant LLM suggestions, cost planning, and ROI insights tailored to your AI use case with advanced analytics and recommendations.
          </p>
          <div className="flex justify-center mt-6 space-x-6">
            <div className="flex items-center text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Real-time Analysis</span>
            </div>
            <div className="flex items-center text-teal-400">
              <div className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Cost Optimization</span>
            </div>
            <div className="flex items-center text-cyan-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">ROI Insights</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700/50 shadow-2xl mb-8 hover:shadow-3xl transition-shadow duration-500">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-gray-700/50">
            <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping absolute"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
              </div>
              AI Cost Optimization Analysis
              <div className="ml-auto text-sm font-normal text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                Enterprise Ready
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Volume */}
                <div>
                  <Label htmlFor="monthlyVolume" className="text-white font-semibold mb-2 block">
                    Monthly Token Volume (estimated)
                  </Label>
                  <Input
                    id="monthlyVolume"
                    type="number"
                    min={1000}
                    value={formData.monthlyVolume}
                    onChange={e => setFormData(prev => ({ ...prev, monthlyVolume: Number(e.target.value) }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                {/* Budget */}
                <div>
                  <Label htmlFor="budget" className="text-white font-semibold mb-2 block">
                    Monthly Budget (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min={10}
                    value={formData.budget}
                    onChange={e => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                {/* Domain */}
                <div>
                  <Label htmlFor="domain" className="text-white font-semibold mb-2 block">
                    Business Domain
                  </Label>
                  <select
                    id="domain"
                    value={formData.domain}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        domain: e.target.value,
                        useCase: suggestedUseCases[e.target.value as keyof typeof suggestedUseCases] || "",
                      }))
                    }}
                    className="w-full bg-gray-800/50 border-gray-600 text-white rounded-md px-3 py-2 focus:border-emerald-400 focus:ring-emerald-400"
                  >
                    {Object.keys(suggestedUseCases).map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority" className="text-white font-semibold mb-2 block">
                    Optimization Priority
                  </Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full bg-gray-800/50 border-gray-600 text-white rounded-md px-3 py-2 focus:border-emerald-400 focus:ring-emerald-400"
                  >
                    <option value="cost">Cost</option>
                    <option value="latency">Latency</option>
                    <option value="quality">Quality</option>
                    <option value="balance">Balance</option>
                  </select>
                </div>

                {/* Team Size */}
                <div>
                  <Label htmlFor="teamSize" className="text-white font-semibold mb-2 block">
                    Team Size or Scale
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    value={formData.teamSize}
                    onChange={e => setFormData(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>

                {/* Infrastructure */}
                <div>
                  <Label htmlFor="infrastructure" className="text-white font-semibold mb-2 block">
                    Cloud Infrastructure
                  </Label>
                  <select
                    id="infrastructure"
                    value={formData.infrastructure}
                    onChange={e => setFormData(prev => ({ ...prev, infrastructure: e.target.value }))}
                    className="w-full bg-gray-800/50 border-gray-600 text-white rounded-md px-3 py-2 focus:border-emerald-400 focus:ring-emerald-400"
                  >
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              {/* Use Case */}
              <div>
                <Label htmlFor="useCase" className="text-white font-semibold mb-2 block">
                  Planned AI Use Case(s)
                </Label>
                <Textarea
                  id="useCase"
                  value={formData.useCase}
                  onChange={e => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                  rows={3}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              {/* Current Models */}
              <div>
                <Label className="text-white font-semibold mb-3 block">
                  Current LLM Models (if any)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {["GPT-4", "GPT-3.5", "Claude", "Gemini", "Llama", "Other"].map((model) => (
                    <button
                      type="button"
                      key={model}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.currentModels.includes(model)
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        currentModels: prev.currentModels.includes(model)
                          ? prev.currentModels.filter(m => m !== model)
                          : [...prev.currentModels, model],
                      }))}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organizational Functions */}
              <div>
                <Label className="text-white font-semibold mb-3 block">
                  Organizational Functions (where AI will be applied)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {orgFunctionOptions.map((fn) => (
                    <button
                      type="button"
                      key={fn}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.organizationalFunctions.includes(fn)
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        organizationalFunctions: prev.organizationalFunctions.includes(fn)
                          ? prev.organizationalFunctions.filter(f => f !== fn)
                          : [...prev.organizationalFunctions, fn],
                      }))}
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-white font-semibold mb-2 block">
                  Your Email (for report delivery)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-400"
                  placeholder="you@company.com"
                />
              </div>

              {/* Send Email & Generate PDF */}
              <div className="flex items-center gap-8 mt-2">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.sendEmail}
                    onChange={e => setFormData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                    className="accent-emerald-500 w-5 h-5"
                  />
                  Send report to my email
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.generatePdf || false}
                    onChange={e => setFormData(prev => ({ ...prev, generatePdf: e.target.checked }))}
                    className="accent-emerald-500 w-5 h-5"
                  />
                  Generate PDF report
                </label>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                  <div className="relative">
                    <Loader2 className="animate-spin h-8 w-8 text-emerald-400" />
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <span className="text-emerald-400 font-medium text-lg">
                      Analyzing your requirements...
                    </span>
                    <div className="w-64 bg-gray-700 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 mt-2 block">{Math.round(progress)}% Complete</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-700/50">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-5 text-lg shadow-lg transition-all transform hover:scale-[1.02] border-0 relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5" />
                        Generate Cost Optimization Report
                        <div className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                          Free Analysis
                        </div>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results - Enhanced AI Cost Optimization Report */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg">Analysis Complete!</h3>
                  <p className="text-gray-300 text-sm">Your personalized AI cost optimization report is ready</p>
                </div>
                <div className="ml-auto text-emerald-400 text-sm font-mono bg-emerald-500/20 px-3 py-1 rounded-full">
                  100% ✓
                </div>
              </div>
            </div>

            {/* Key Metrics Summary Cards */}
            {result.response && (() => {
              const metrics = extractKeyMetrics(result.response);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
                  <MetricCard 
                    title="Recommended Model" 
                    value={metrics.recommendedModel} 
                    subtitle="Best cost-performance ratio" 
                    trend="up" 
                  />
                  <MetricCard 
                    title="Estimated ROI" 
                    value={metrics.roi} 
                    subtitle="Return on Investment" 
                    trend="up" 
                  />
                  <MetricCard 
                    title="Break-even Period" 
                    value={metrics.breakeven} 
                    subtitle="Time to profitability" 
                  />
                  <MetricCard 
                    title="Monthly Cost Range" 
                    value={metrics.costRange} 
                    subtitle="Optimized pricing range" 
                  />
                </div>
              );
            })()}
            
            {result.response && (
              <div className="space-y-8 opacity-0 animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                {/* Modern Report Header */}
                <div className="bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-white mb-2">AI Cost Analysis Report</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-medium">
                            {formData.domain} Domain
                          </span>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full font-medium">
                            ${formData.budget}/month Budget
                          </span>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full font-medium">
                            {formData.monthlyVolume.toLocaleString()} Tokens/month
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Generated</div>
                      <div className="text-white font-medium">{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Custom Parsed Content */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Main Content Column */}
                  <div className="xl:col-span-2 space-y-8">
                    <ReactMarkdown
                      children={result.response.replace(/^```markdown\n/, '').replace(/\n```$/, '')}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          return (
                            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-indigo-500/20 mb-8">
                              <h1 className="text-3xl font-bold text-white flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                  <span className="text-xl">🎯</span>
                                </div>
                                <span>{text.replace(/🎯|📝|📋/g, '').trim()}</span>
                              </h1>
                            </div>
                          );
                        },
                        h2: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          return (
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📊</span>
                              </div>
                              <h2 className="text-2xl font-bold text-white">
                                {text.replace(/📊|📝|📋/g, '').trim()}
                              </h2>
                            </div>
                          );
                        },
                        h3: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          let icon = '🔍';
                          let colors = 'from-cyan-500 to-blue-500';
                          
                          if (text.includes('LLM Recommendations')) {
                            icon = '🤖'; colors = 'from-emerald-500 to-teal-500';
                          } else if (text.includes('Token Cost')) {
                            icon = '💰'; colors = 'from-yellow-500 to-orange-500';
                          } else if (text.includes('Credit Usage')) {
                            icon = '⚠️'; colors = 'from-amber-500 to-red-500';
                          } else if (text.includes('ROI') || text.includes('Payback')) {
                            icon = '📈'; colors = 'from-green-500 to-emerald-500';
                          } else if (text.includes('Infrastructure')) {
                            icon = '🏗️'; colors = 'from-purple-500 to-indigo-500';
                          }
                          
                          return (
                            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${colors} rounded-xl flex items-center justify-center shadow-lg`}>
                                  <span className="text-lg">{icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                  {text.replace(/🔍|💰|⚠️|📈|🏗️|⚙️|💡|🧠|📄|🤖|[0-9]+\./g, '').trim()}
                                </h3>
                              </div>
                            </div>
                          );
                        },
                        ul: ({node, ...props}) => <ul className="space-y-3 mb-6" {...props} />,
                        li: ({node, children, ...props}) => (
                          <li className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-200 leading-relaxed">{children}</span>
                          </li>
                        ),
                        table: ({node, ...props}) => (
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 overflow-hidden">
                            <table className="w-full" {...props} />
                          </div>
                        ),
                        thead: ({node, ...props}) => <thead className="border-b border-white/20" {...props} />,
                        th: ({node, ...props}) => (
                          <th className="text-left py-4 px-4 font-bold text-white text-sm uppercase tracking-wider" {...props} />
                        ),
                        tbody: ({node, ...props}) => <tbody {...props} />,
                        tr: ({node, ...props}) => <tr className="border-b border-white/10 hover:bg-white/5 transition-colors" {...props} />,
                        td: ({node, children, ...props}) => {
                          const text = children?.toString() || '';
                          let className = "py-4 px-4 text-gray-200";
                          
                          if (text.includes('$') || text.includes('%') || text.includes('weeks')) {
                            className += " font-bold text-emerald-300";
                          } else if (text.includes('Nova') || text.includes('Claude') || text.includes('Mistral')) {
                            className += " font-semibold text-cyan-300";
                          }
                          
                          return <td className={className} {...props}>{children}</td>;
                        },
                        p: ({node, children, ...props}) => (
                          <p className="text-gray-200 leading-relaxed mb-4" {...props} />
                        ),
                        strong: ({node, children, ...props}) => (
                          <strong className="text-emerald-300 font-bold" {...props} />
                        ),
                        code: ({node, ...props}) => (
                          <code className="bg-gray-800 text-emerald-300 px-2 py-1 rounded text-sm font-mono" {...props} />
                        ),
                      }}
                    />
                  </div>

                  {/* Sidebar with Key Info */}
                  <div className="space-y-6">
                    {/* Executive Summary Card */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <span className="text-lg">📋</span>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-300">Executive Summary</h3>
                      </div>
                      <div className="space-y-4 text-sm text-gray-300">
                        <div className="flex justify-between items-center">
                          <span>Recommended Model:</span>
                          <span className="font-bold text-cyan-300">Nova Lite</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Est. Monthly Cost:</span>
                          <span className="font-bold text-emerald-300">$18-24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Potential Savings:</span>
                          <span className="font-bold text-green-300">65-80%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>ROI Timeline:</span>
                          <span className="font-bold text-yellow-300">5-8 weeks</span>
                        </div>
                      </div>
                    </div>

                    {/* Implementation Timeline */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-lg">⏱️</span>
                        </div>
                        <h3 className="text-xl font-bold text-blue-300">Implementation Timeline</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="text-sm">
                            <div className="text-white font-medium">Week 1-2</div>
                            <div className="text-gray-400">AWS Bedrock Setup</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div className="text-sm">
                            <div className="text-white font-medium">Week 3-4</div>
                            <div className="text-gray-400">Model Integration</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div className="text-sm">
                            <div className="text-white font-medium">Week 5-6</div>
                            <div className="text-gray-400">Optimization & Testing</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                          <span className="text-lg">⚠️</span>
                        </div>
                        <h3 className="text-xl font-bold text-amber-300">Risk Assessment</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-300">Low migration risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-300">Moderate integration effort</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-300">High cost savings potential</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Items - Redesigned */}
                <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-indigo-500/20">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-2">Next Steps</h3>
                    <p className="text-gray-400">Prioritized action items for implementation</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all group">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-xl">🚀</span>
                      </div>
                      <h4 className="text-lg font-bold text-emerald-300 mb-3">Immediate (Week 1)</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Set up AWS Bedrock account</li>
                        <li>• Configure Nova Lite access</li>
                        <li>• Plan migration strategy</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all group">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-xl">⚙️</span>
                      </div>
                      <h4 className="text-lg font-bold text-blue-300 mb-3">Short-term (Week 2-4)</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Implement serverless architecture</li>
                        <li>• Set up monitoring & logging</li>
                        <li>• Configure cost alerts</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all group">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-xl">📈</span>
                      </div>
                      <h4 className="text-lg font-bold text-purple-300 mb-3">Long-term (Week 5+)</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Optimize with caching</li>
                        <li>• Implement batch processing</li>
                        <li>• Scale and fine-tune</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
                <ReactMarkdown
                  children={result.response.replace(/^```markdown\n/, '').replace(/\n```$/, '')}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let icon = '🎯';
                      let gradientFrom = 'from-emerald-500/20';
                      let gradientTo = 'to-teal-500/20';
                      let borderColor = 'border-emerald-400';
                      
                      if (text.includes('Input Context')) {
                        icon = '📝';
                        gradientFrom = 'from-blue-500/20';
                        gradientTo = 'to-indigo-500/20';
                        borderColor = 'border-blue-400';
                      } else if (text.includes('Structured Output')) {
                        icon = '📋';
                        gradientFrom = 'from-purple-500/20';
                        gradientTo = 'to-pink-500/20';
                        borderColor = 'border-purple-400';
                      }
                      
                      return (
                        <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-l-4 ${borderColor} rounded-r-lg px-6 py-4 my-8 shadow-lg`}>
                          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span className="text-3xl">{icon}</span>
                            <span>{text.replace(/🎯|📝|📋/g, '').trim()}</span>
                          </h1>
                        </div>
                      );
                    },
                    h2: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let icon = '📊';
                      let gradientFrom = 'from-blue-500/15';
                      let gradientTo = 'to-purple-500/15';
                      let borderColor = 'border-blue-400';
                      
                      if (text.includes('Input Context')) {
                        icon = '📝';
                      } else if (text.includes('Structured Output')) {
                        icon = '📋';
                      }
                      
                      return (
                        <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-l-4 ${borderColor} rounded-r-lg px-4 py-3 my-6 shadow-md`}>
                          <h2 className="text-2xl font-bold text-blue-300 flex items-center gap-2">
                            <span className="text-2xl">{icon}</span>
                            <span>{text.replace(/📊|📝|📋/g, '').trim()}</span>
                          </h2>
                        </div>
                      );
                    },
                    h3: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let icon = '🔍';
                      let bgColor = 'from-cyan-500 to-blue-500';
                      
                      if (text.includes('LLM Recommendations')) {
                        icon = '🔍';
                        bgColor = 'from-emerald-500 to-teal-500';
                      } else if (text.includes('Token Cost')) {
                        icon = '�';
                        bgColor = 'from-yellow-500 to-orange-500';
                      } else if (text.includes('Credit Usage')) {
                        icon = '⚠️';
                        bgColor = 'from-amber-500 to-red-500';
                      } else if (text.includes('ROI') || text.includes('Payback')) {
                        icon = '📈';
                        bgColor = 'from-green-500 to-emerald-500';
                      } else if (text.includes('Agent Architecture')) {
                        icon = '🏗️';
                        bgColor = 'from-purple-500 to-indigo-500';
                      } else if (text.includes('Infrastructure')) {
                        icon = '⚙️';
                        bgColor = 'from-gray-500 to-slate-500';
                      } else if (text.includes('Cost-saving')) {
                        icon = '�';
                        bgColor = 'from-teal-500 to-cyan-500';
                      } else if (text.includes('LLM Match Score')) {
                        icon = '🧠';
                        bgColor = 'from-pink-500 to-rose-500';
                      } else if (text.includes('Final Summary')) {
                        icon = '📄';
                        bgColor = 'from-blue-500 to-indigo-500';
                      }
                      
                      return (
                        <div className="flex items-center gap-3 mt-8 mb-4 pb-3 border-b border-gray-600/50">
                          <div className={`w-10 h-10 bg-gradient-to-r ${bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
                            <span className="text-xl">{icon}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-cyan-300">
                            {text.replace(/🔍|💰|⚠️|📈|🏗️|⚙️|💡|🧠|📄|[0-9]+\./g, '').trim()}
                          </h3>
                        </div>
                      );
                    },
                    ul: ({node, ...props}) => <ul className="list-none pl-0 mb-6 space-y-3 text-gray-200" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-200" {...props} />,
                    li: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let icon = <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />;
                      let bgClass = "bg-gray-800/40 border-emerald-400/50 hover:border-emerald-400";
                      
                      if (text.includes('High') && (text.includes('Credit Usage') || text.includes('consumption'))) {
                        icon = <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />;
                        bgClass = "bg-amber-500/10 border-amber-400/50 hover:border-amber-400";
                      } else if (text.includes('Medium') && (text.includes('Credit Usage') || text.includes('consumption'))) {
                        icon = <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />;
                        bgClass = "bg-blue-500/10 border-blue-400/50 hover:border-blue-400";
                      }
                      
                      return (
                        <li className={`${bgClass} rounded-xl px-5 py-4 border-l-4 transition-all duration-200 flex items-start gap-3 shadow-sm hover:shadow-md`}>
                          {icon}
                          <span className="text-gray-200 leading-relaxed">{children}</span>
                        </li>
                      );
                    },
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-8 rounded-xl border border-gray-600 shadow-xl bg-gray-800/30 backdrop-blur-sm">
                        <table className="min-w-full text-sm text-left" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white" {...props} />,
                    th: ({node, ...props}) => <th className="px-6 py-4 font-bold text-white border-r border-emerald-500/30 last:border-r-0 tracking-wide text-sm uppercase" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-600/50" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-gray-700/30 transition-colors duration-200" {...props} />,
                    td: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let className = "px-6 py-4 text-gray-200 border-r border-gray-600/30 last:border-r-0";
                      
                      // Highlight important values
                      if (text.includes('$') || text.includes('%') || text.includes('ROI') || text.includes('weeks')) {
                        className += " font-bold text-emerald-300 bg-emerald-500/10";
                      } else if (text.includes('Nova Lite') || text.includes('Mistral Small') || text.includes('Claude')) {
                        className += " font-semibold text-cyan-300 bg-cyan-500/10";
                      } else if (text.includes('High') && (text.includes('quality') || text.includes('efficiency'))) {
                        className += " text-emerald-400 font-medium";
                      } else if (text.includes('High') && text.includes('usage')) {
                        className += " text-amber-400 font-medium";
                      }
                      
                      return <td className={className} {...props} />;
                    },
                    code: ({node, ...props}) => <code className="bg-emerald-900/40 text-emerald-300 px-3 py-1 rounded-md font-mono text-sm border border-emerald-700/50" {...props} />,
                    p: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let className = "mb-4 text-gray-200 leading-relaxed text-base";
                      
                      // Special styling for executive summary
                      if (text.includes('Executive Summary')) {
                        className = "mb-6 text-xl text-white leading-relaxed bg-gradient-to-r from-gray-800/80 to-gray-700/80 p-6 rounded-xl border border-gray-600/50 shadow-lg backdrop-blur-sm";
                      }
                      
                      return <p className={className} {...props} />;
                    },
                    strong: ({node, children, ...props}) => {
                      const text = children?.toString() || '';
                      let className = "text-emerald-400 font-bold";
                      
                      if (text.includes('Executive Summary')) {
                        className = "text-amber-300 font-bold text-2xl";
                      }
                      
                      return <strong className={className} {...props} />;
                    },
                    hr: ({node, ...props}) => (
                      <div className="my-10 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-40" {...props} />
                    ),
                  }}
                />
                
                {/* Quick Action Recommendations */}
                <div className="mt-10 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-2xl p-8 border border-emerald-500/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-400">Quick Action Items</h3>
                      <p className="text-gray-300 text-sm">Immediate steps to optimize your AI costs</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <h4 className="font-bold text-white text-lg">Immediate Steps</h4>
                      </div>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Set up AWS Bedrock with Nova Lite</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Configure serverless Lambda triggers</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Implement caching for frequent queries</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                        <h4 className="font-bold text-white text-lg">Cost Optimization</h4>
                      </div>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Use embeddings for FAQ responses</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Batch processing for reports</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Monitor and adjust token usage</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 opacity-0 animate-fade-in" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
              <Button 
                onClick={downloadPDF}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 shadow-xl transition-all transform hover:scale-[1.02] border-0 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download PDF Report
                  <div className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">Premium</div>
                </div>
              </Button>
              <Button
                onClick={() => {
                  if (navigator.share && result?.response) {
                    navigator.share({
                      title: 'AI Cost Optimization Report',
                      text: 'Check out my AI cost optimization analysis',
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                variant="outline"
                className="flex-1 border-2 border-emerald-600 text-emerald-300 hover:bg-emerald-800/20 hover:text-emerald-200 bg-transparent backdrop-blur-sm py-4 font-bold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/10 to-emerald-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" />
                  Share Report
                </div>
              </Button>
              <Button
                onClick={() => setShowRaw(!showRaw)}
                variant="outline"
                className="flex-1 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent backdrop-blur-sm py-4 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  {showRaw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  {showRaw ? "Hide" : "Show"} Raw Data
                </div>
              </Button>
            </div>
            {/* Raw Data */}
            {showRaw && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                <h3 className="text-white font-bold mb-4">Raw Analysis Data</h3>
                <pre className="text-xs text-gray-300 overflow-x-auto bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
