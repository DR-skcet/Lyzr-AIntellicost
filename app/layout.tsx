import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lyzr AI Cost Optimizer - Enterprise AI Agent Architect",
  description:
    "Built with Lyzr Studio - Optimize your AI costs, select the right LLMs, and maximize ROI with our enterprise AI cost optimization advisor.",
  keywords: "AI cost optimization, Lyzr Studio, enterprise AI, LLM selection, AWS Bedrock, Amazon Nova, AI ROI",
  authors: [{ name: "Lyzr Studio" }],
  openGraph: {
    title: "Lyzr AI Cost Optimizer - Enterprise AI Agent Architect",
    description: "Built with Lyzr Studio - Optimize your AI costs and maximize ROI",
    images: ["/og-image.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
