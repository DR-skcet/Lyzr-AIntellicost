"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, Mail, Eye, EyeOff, TrendingUp, DollarSign, Zap, Target, Award, BarChart3 } from "lucide-react"
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
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-lg p-4 border border-gray-600/50">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-300 font-medium">{title}</p>
        {trend && (
          <TrendingUp className={`h-4 w-4 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'} ${trend === 'down' ? 'rotate-180' : ''}`} />
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  )

  // Add options for organizational functions
  const orgFunctionOptions = [
    "HR", "Finance", "Support", "Sales", "Operations", "IT", "Legal", "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            AIntellicost
          </h1>
          <p className="text-xl text-white font-medium">Enterprise AI Cost Optimization Advisor</p>
          <p className="text-white mt-2">Get instant LLM suggestions, cost planning, and ROI insights tailored to your AI use case</p>
        </div>

        {/* Form */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-gray-700/50 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              AI Cost Optimization Analysis
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
                <div className="flex items-center justify-center gap-3 py-4">
                  <Loader2 className="animate-spin h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    Analyzing your requirements... {Math.round(progress)}%
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-white text-black font-bold py-4 text-lg shadow-lg transition-all transform hover:scale-[1.02] border border-gray-300 hover:bg-gray-100"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Generate Cost Optimization Report"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results - Markdown style AI Cost Optimization Report */}
        {result && (
          <div className="space-y-8">
            {result.response && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-xl">
                <h2 className="text-4xl font-extrabold text-white mb-6 flex items-center gap-2" style={{ fontSize: '2.5rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>🤖</span> AI Cost Optimization Report
                </h2>
                <ReactMarkdown
                  children={result.response}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-emerald-400 mt-6 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-emerald-300 mt-5 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-emerald-200 mt-4 mb-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-2 text-gray-200" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-2 text-gray-200" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    table: ({node, ...props}) => <table className="min-w-full border border-gray-700 my-4 text-sm text-left text-gray-200" {...props} />,
                    thead: ({node, ...props}) => <thead className="bg-emerald-900/60" {...props} />,
                    th: ({node, ...props}) => <th className="px-3 py-2 border border-gray-700 font-bold" {...props} />,
                    td: ({node, ...props}) => <td className="px-3 py-2 border border-gray-700" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-800 px-1 rounded text-emerald-300" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 text-gray-200" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-emerald-400" {...props} />,
                  }}
                />
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={downloadPDF}
                className="flex-1 bg-white text-black font-bold py-3 shadow-lg border border-gray-300 hover:bg-gray-100"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </Button>
              <Button
                onClick={() => setShowRaw(!showRaw)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {showRaw ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showRaw ? "Hide" : "Show"} Raw Data
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
