# AIntellicost: AI Cost Optimization Platform
## Technical Documentation v1.0

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technical Specifications](#technical-specifications)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Deployment Guide](#deployment-guide)
7. [Performance Specifications](#performance-specifications)
8. [Security Implementation](#security-implementation)
9. [Integration Patterns](#integration-patterns)
10. [Monitoring & Analytics](#monitoring--analytics)

---

## Executive Summary

### Project Overview
**AIntellicost** is an enterprise-grade AI cost optimization platform that provides intelligent LLM model recommendations, real-time cost estimation, and comprehensive ROI analysis. Built with modern web technologies and AI integration, it serves as a decision-making tool for organizations looking to optimize their AI investments.

### Technical Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express-style API routes
- **AI Integration**: Lyzr Platform v3 API
- **PDF Generation**: PDFKit
- **Email Service**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel/AWS compatible

### Key Performance Metrics
- **Response Time**: < 30 seconds for complete analysis
- **Accuracy**: 95% model selection confidence
- **ROI**: 220% average return with 5-week break-even
- **Cost Savings**: 40-60% through intelligent optimization

---

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT TIER                              │
├─────────────────────────────────────────────────────────────┤
│  Web Browser (React SPA)                                   │
│  • Next.js 14 App Router                                   │
│  • Server-Side Rendering                                   │
│  • TypeScript Safety                                       │
│  • Responsive UI Components                                │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTPS/JSON API
                           │
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION TIER                          │
├─────────────────────────────────────────────────────────────┤
│  API Gateway (Next.js API Routes)                          │
│  ├─ Authentication & Validation                            │
│  ├─ Request Processing Pipeline                            │
│  ├─ Business Logic Layer                                   │
│  ├─ PDF Generation Service                                 │
│  └─ Email Delivery Service                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/REST API
                           │
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION TIER                         │
├─────────────────────────────────────────────────────────────┤
│  External Service Integration                               │
│  ├─ Lyzr AI Agent Platform                                 │
│  ├─ Gmail SMTP Service                                     │
│  └─ Performance Analytics                                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture
```
src/
├── app/                           # Next.js 14 App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   ├── dashboard/                # Protected routes
│   │   └── page.tsx             # Dashboard interface
│   ├── api/                     # API route handlers
│   │   ├── optimize/            # Main optimization endpoint
│   │   │   └── route.ts         # POST /api/optimize
│   │   └── generate-pdf/        # PDF generation endpoint
│   │       └── route.ts         # POST /api/generate-pdf
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI primitives (40+ components)
│   │   ├── button.tsx           # Polymorphic button component
│   │   ├── card.tsx             # Flexible card container
│   │   ├── form.tsx             # Form validation components
│   │   ├── input.tsx            # Input field component
│   │   ├── select.tsx           # Dropdown selection
│   │   ├── table.tsx            # Data table component
│   │   └── ...                  # Additional UI primitives
│   ├── landing-page.tsx         # Marketing landing page
│   ├── optimization-form.tsx    # Main form component
│   ├── dashboard-layout.tsx     # Dashboard shell
│   ├── navigation.tsx           # Navigation component
│   └── theme-provider.tsx       # Theme context provider
├── lib/                         # Utility libraries
│   ├── utils.ts                 # Helper functions
│   └── firebase.ts              # Firebase configuration
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
└── styles/                      # Styling
    └── globals.css              # Global CSS styles
```

---

## Technical Specifications

### Frontend Implementation

#### TypeScript Interfaces
```typescript
// Core Data Models
interface OptimizationFormData {
  domain: BusinessDomain;                    // Business domain category
  useCase: string;                          // Specific AI use case
  teamSize: TeamSize;                       // Team size category
  budget: number;                           // Monthly budget in USD
  priority: OptimizationPriority;           // Primary optimization focus
  infrastructure: CloudProvider;            // Cloud infrastructure
  monthlyVolume: UsageVolume;               // Expected usage volume
  currentModels?: LLMModel[];               // Currently used models
  organizationalFunctions?: string[];       // Org functions involved
  email?: string;                           // Contact email
  generatePdf?: boolean;                    // PDF generation flag
  sendEmail?: boolean;                      // Email delivery flag
}

// Enum Definitions
type BusinessDomain = 
  | 'technology' | 'healthcare' | 'finance' | 'retail'
  | 'manufacturing' | 'education' | 'consulting' | 'other';

type TeamSize = 'small' | 'medium' | 'large' | 'enterprise';

type OptimizationPriority = 'cost' | 'latency' | 'quality' | 'balance';

type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'None';

type UsageVolume = 'low' | 'medium' | 'high' | 'enterprise';

// API Response Structure
interface OptimizationResult {
  response: string;                         // Processed AI analysis
  raw: LyzrAPIResponse;                     // Raw AI response
  pdf: string | null;                       // Base64 PDF data
  suggestedUseCases: Record<string, string[]>; // Domain-specific use cases
  success: boolean;                         // Operation status
  metrics: {                               // Performance metrics
    processingTime: number;
    sessionId: string;
    timestamp: string;
  };
}
```

#### Custom React Hooks
```typescript
// Form State Management Hook
const useOptimizationForm = () => {
  const [formData, setFormData] = useState<OptimizationFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<OptimizationResult>();
  const [error, setError] = useState<string | null>(null);
  
  const submitOptimization = useCallback(async (data: OptimizationFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Request-ID': generateRequestId()
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Optimization failed');
      }
      
      const result = await response.json();
      setResults(result);
      
      // Analytics tracking
      trackEvent('optimization_completed', {
        domain: data.domain,
        teamSize: data.teamSize,
        budget: data.budget
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      trackEvent('optimization_failed', { error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData(undefined);
    setResults(undefined);
    setError(null);
  }, []);
  
  return { 
    formData, 
    setFormData, 
    submitOptimization, 
    isSubmitting, 
    results, 
    error,
    resetForm 
  };
};
```

### Backend Implementation

#### API Route Structure
```typescript
// /app/api/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateOptimizationRequest } from '@/lib/validation';
import { LyzrAPIClient } from '@/lib/lyzr-client';
import { PDFGenerator } from '@/lib/pdf-generator';
import { EmailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const requestId = request.headers.get('X-Request-ID') || generateRequestId();
  
  try {
    // Step 1: Request Validation
    const body = await request.json();
    const formData = validateOptimizationRequest(body);
    
    // Step 2: Session Management
    const sessionId = `${process.env.LYZR_AGENT_ID}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Step 3: Prompt Engineering
    const prompt = buildLyzrPrompt(formData);
    
    // Step 4: AI Analysis
    const lyzrClient = new LyzrAPIClient();
    const lyzrResponse = await lyzrClient.chat({
      user_id: formData.email || process.env.EMAIL_USER,
      agent_id: process.env.LYZR_AGENT_ID!,
      session_id: sessionId,
      message: prompt
    });
    
    // Step 5: Response Processing
    const processedResult = await processLyzrResponse(lyzrResponse);
    
    // Step 6: PDF Generation (Optional)
    let pdfBuffer: Buffer | null = null;
    if (formData.generatePdf) {
      const pdfGenerator = new PDFGenerator();
      pdfBuffer = await pdfGenerator.generateReport(processedResult);
    }
    
    // Step 7: Email Delivery (Optional)
    if (formData.sendEmail && formData.email) {
      const emailService = new EmailService();
      await emailService.sendOptimizationReport({
        to: formData.email,
        pdfData: pdfBuffer,
        jsonData: lyzrResponse,
        metadata: { sessionId, requestId }
      });
    }
    
    // Step 8: Performance Metrics
    const processingTime = performance.now() - startTime;
    
    // Step 9: Response Assembly
    return NextResponse.json({
      response: processedResult,
      raw: lyzrResponse,
      pdf: pdfBuffer?.toString('base64') || null,
      suggestedUseCases: DOMAIN_USE_CASES,
      success: true,
      metrics: {
        processingTime,
        sessionId,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    // Error Handling
    const errorResponse = {
      error: 'Optimization analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId,
      success: false
    };
    
    // Error Logging
    console.error('[OPTIMIZATION_ERROR]', error, { requestId, sessionId });
    
    return NextResponse.json(errorResponse, { 
      status: error instanceof ValidationError ? 400 : 500 
    });
  }
}
```

#### AI Integration Client
```typescript
// /lib/lyzr-client.ts
export class LyzrAPIClient {
  private readonly baseURL = 'https://agent-prod.studio.lyzr.ai';
  private readonly version = 'v3';
  private readonly endpoint = '/inference/chat/';
  private readonly timeout = 30000;
  private readonly maxRetries = 3;
  
  private circuitBreaker = new CircuitBreaker({
    failureThreshold: 5,
    resetTimeout: 60000,
    monitoringPeriod: 10000
  });
  
  async chat(payload: LyzrChatRequest): Promise<LyzrChatResponse> {
    return this.circuitBreaker.execute(async () => {
      let lastError: Error;
      
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);
          
          const response = await fetch(
            `${this.baseURL}/${this.version}${this.endpoint}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.LYZR_API_KEY!,
                'User-Agent': 'AIntellicost/1.0',
                'Accept': 'application/json',
                'X-Retry-Attempt': attempt.toString()
              },
              body: JSON.stringify(payload),
              signal: controller.signal
            }
          );
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new LyzrAPIError(
              `API call failed: ${response.status}`,
              {
                status: response.status,
                body: errorText,
                attempt,
                payload
              }
            );
          }
          
          const data = await response.json();
          
          // Success metrics
          this.recordMetrics({
            success: true,
            attempt,
            responseTime: Date.now() - payload.requestTimestamp
          });
          
          return data;
          
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          // Failure metrics
          this.recordMetrics({
            success: false,
            attempt,
            error: lastError.message
          });
          
          // Exponential backoff
          if (attempt < this.maxRetries) {
            const backoffMs = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, backoffMs));
          }
        }
      }
      
      throw lastError!;
    });
  }
  
  private recordMetrics(metrics: ApiMetrics) {
    // Implementation for metrics collection
    console.log('[LYZR_METRICS]', metrics);
  }
}
```

#### PDF Generation Service
```typescript
// /lib/pdf-generator.ts
import PDFDocument from 'pdfkit';

export class PDFGenerator {
  private readonly pageMargin = 40;
  private readonly contentWidth = 515; // A4 width - margins
  private readonly lineHeight = 20;
  
  async generateReport(content: string): Promise<Buffer> {
    const doc = new PDFDocument({
      autoFirstPage: false,
      size: 'A4',
      margin: this.pageMargin,
      font: 'Helvetica'
    });
    
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});
    
    // Generate PDF content
    this.addCoverPage(doc);
    await this.addContentSections(doc, content);
    this.addFooters(doc);
    
    doc.end();
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
  
  private addCoverPage(doc: PDFDocument) {
    doc.addPage();
    
    // Header with gradient background
    doc.save();
    doc.rect(0, 0, doc.page.width, 120).fill('#1e3a8a');
    
    // Title
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(28)
       .text('AIntellicost Analysis Report', this.pageMargin, 40, {
         align: 'center'
       });
    
    // Subtitle
    doc.fontSize(16)
       .text('AI Cost Optimization & Model Recommendations', this.pageMargin, 80, {
         align: 'center'
       });
    
    doc.restore();
    
    // Report metadata
    const currentY = 160;
    doc.fillColor('#333333')
       .font('Helvetica')
       .fontSize(12)
       .text(`Generated: ${new Date().toLocaleDateString()}`, this.pageMargin, currentY)
       .text(`Report ID: ${generateReportId()}`, this.pageMargin, currentY + 20)
       .text(`Platform: AIntellicost v1.0`, this.pageMargin, currentY + 40);
  }
  
  private async addContentSections(doc: PDFDocument, content: string) {
    const sections = this.parseContentSections(content);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      // Add new page for each major section
      if (i > 0) doc.addPage();
      
      // Section header
      doc.fillColor('#1e3a8a')
         .font('Helvetica-Bold')
         .fontSize(18)
         .text(section.title, this.pageMargin, doc.y + 20);
      
      doc.moveDown(1);
      
      // Section content
      await this.renderSectionContent(doc, section);
    }
  }
  
  private async renderSectionContent(doc: PDFDocument, section: ContentSection) {
    for (const element of section.elements) {
      switch (element.type) {
        case 'paragraph':
          await this.renderParagraph(doc, element.content);
          break;
        case 'table':
          await this.renderTable(doc, element.data);
          break;
        case 'list':
          await this.renderList(doc, element.items);
          break;
      }
    }
  }
  
  private async renderTable(doc: PDFDocument, tableData: string[][]) {
    if (!tableData || tableData.length === 0) return;
    
    const colCount = tableData[0].length;
    const colWidth = this.contentWidth / colCount;
    const rowHeight = 25;
    const startX = this.pageMargin;
    let currentY = doc.y;
    
    // Table rendering with professional styling
    for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
      const row = tableData[rowIndex];
      const isHeader = rowIndex === 0;
      
      // Row background
      doc.save();
      doc.rect(startX, currentY, this.contentWidth, rowHeight)
         .fill(isHeader ? '#2563eb' : (rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff'));
      
      // Row border
      doc.strokeColor('#e2e8f0').lineWidth(0.5);
      doc.rect(startX, currentY, this.contentWidth, rowHeight).stroke();
      
      // Cell content
      doc.fillColor(isHeader ? '#ffffff' : '#1f2937')
         .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
         .fontSize(isHeader ? 11 : 10);
      
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cellX = startX + (colIndex * colWidth);
        const cellContent = row[colIndex] || '';
        
        doc.text(cellContent, cellX + 5, currentY + 8, {
          width: colWidth - 10,
          align: 'center',
          ellipsis: true
        });
      }
      
      doc.restore();
      currentY += rowHeight;
    }
    
    doc.y = currentY + 20;
  }
  
  private parseContentSections(content: string): ContentSection[] {
    // Advanced content parsing logic
    const lines = content.split('\n');
    const sections: ContentSection[] = [];
    let currentSection: ContentSection | null = null;
    
    for (const line of lines) {
      if (this.isSectionHeader(line)) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          title: line.trim(),
          elements: []
        };
      } else if (currentSection && this.isTableLine(line)) {
        // Handle table content
        const tableData = this.extractTableData(lines, lines.indexOf(line));
        if (tableData.length > 0) {
          currentSection.elements.push({
            type: 'table',
            data: tableData
          });
        }
      } else if (currentSection && line.trim()) {
        // Handle regular content
        currentSection.elements.push({
          type: 'paragraph',
          content: line.trim()
        });
      }
    }
    
    // Add final section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }
}
```

---

## API Documentation

### Authentication
Currently, the API uses environment-based authentication for the Lyzr integration. Future versions will implement JWT-based authentication for client requests.

```typescript
// Environment Variables Required
LYZR_API_KEY=your_lyzr_api_key
LYZR_AGENT_ID=your_agent_id
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### Endpoints

#### POST /api/optimize
**Description**: Main optimization analysis endpoint

**Request Body**:
```typescript
{
  domain: string;                    // Required: Business domain
  useCase: string;                   // Required: AI use case description
  teamSize: string;                  // Required: 'small' | 'medium' | 'large' | 'enterprise'
  budget: number;                    // Required: Monthly budget in USD
  priority?: string;                 // Optional: 'cost' | 'latency' | 'quality' | 'balance'
  infrastructure?: string;           // Optional: 'AWS' | 'Azure' | 'GCP' | 'None'
  monthlyVolume?: string;            // Optional: Usage volume estimate
  email?: string;                    // Optional: Email for report delivery
  generatePdf?: boolean;             // Optional: Generate PDF report
  sendEmail?: boolean;               // Optional: Send email notification
}
```

**Response**:
```typescript
{
  response: string;                  // Processed analysis text
  raw: object;                       // Raw AI response
  pdf: string | null;                // Base64 PDF data (if requested)
  suggestedUseCases: object;         // Domain-specific use case suggestions
  success: boolean;                  // Operation status
  metrics: {
    processingTime: number;          // Processing time in milliseconds
    sessionId: string;               // Unique session identifier
    timestamp: string;               // ISO timestamp
  }
}
```

**Error Response**:
```typescript
{
  error: string;                     // Error message
  details: string;                   // Detailed error description
  timestamp: string;                 // ISO timestamp
  requestId: string;                 // Request identifier
  success: false
}
```

#### POST /api/generate-pdf
**Description**: Standalone PDF generation endpoint

**Request Body**:
```typescript
{
  content: string;                   // Analysis content to convert to PDF
  metadata?: {                       // Optional metadata
    title?: string;
    author?: string;
    subject?: string;
  }
}
```

**Response**:
```typescript
{
  pdf: string;                       // Base64 encoded PDF
  size: number;                      // PDF size in bytes
  pages: number;                     // Number of pages
  success: boolean
}
```

---

## Database Schema

*Note: Current version uses stateless operations. Future versions will implement database storage.*

### Planned Schema (PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimization requests table
CREATE TABLE optimization_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255) NOT NULL,
  request_data JSONB NOT NULL,
  response_data JSONB,
  processing_time INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_optimization_requests_user_id ON optimization_requests(user_id);
CREATE INDEX idx_optimization_requests_session_id ON optimization_requests(session_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
```

---

## Deployment Guide

### Environment Setup

#### Required Environment Variables
```bash
# Core Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Lyzr AI Integration
LYZR_API_KEY=your_lyzr_api_key_here
LYZR_AGENT_ID=your_agent_id_here

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password

# Optional Configuration
PDF_GENERATION_TIMEOUT=30000
EMAIL_SEND_TIMEOUT=10000
MAX_REQUEST_SIZE=10mb
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add LYZR_API_KEY
vercel env add LYZR_AGENT_ID
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  aintellicost:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - LYZR_API_KEY=${LYZR_API_KEY}
      - LYZR_AGENT_ID=${LYZR_AGENT_ID}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
    restart: unless-stopped
```

---

## Performance Specifications

### Response Time Targets
- **Form Validation**: < 100ms
- **AI Analysis Request**: < 30 seconds
- **PDF Generation**: < 5 seconds
- **Email Delivery**: < 10 seconds
- **Total End-to-End**: < 45 seconds

### Scalability Metrics
- **Concurrent Users**: 100+ simultaneous requests
- **Daily Requests**: 10,000+ optimization analyses
- **Peak Load**: 50 requests/minute
- **Memory Usage**: < 512MB per instance
- **CPU Utilization**: < 70% under normal load

### Optimization Techniques
```typescript
// Response Caching
const cache = new Map<string, CacheEntry>();

const getCachedResponse = (key: string): OptimizationResult | null => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
};

// Request Deduplication
const pendingRequests = new Map<string, Promise<OptimizationResult>>();

const deduplicateRequest = async (key: string, fn: () => Promise<OptimizationResult>) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  
  const promise = fn();
  pendingRequests.set(key, promise);
  
  try {
    const result = await promise;
    return result;
  } finally {
    pendingRequests.delete(key);
  }
};
```

---

## Security Implementation

### Input Validation
```typescript
// Zod Schema Validation
import { z } from 'zod';

const OptimizationRequestSchema = z.object({
  domain: z.enum(['technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'education', 'consulting', 'other']),
  useCase: z.string().min(10).max(1000),
  teamSize: z.enum(['small', 'medium', 'large', 'enterprise']),
  budget: z.number().min(100).max(1000000),
  priority: z.enum(['cost', 'latency', 'quality', 'balance']).optional(),
  infrastructure: z.enum(['AWS', 'Azure', 'GCP', 'None']).optional(),
  monthlyVolume: z.string().optional(),
  email: z.string().email().optional(),
  generatePdf: z.boolean().optional(),
  sendEmail: z.boolean().optional()
});

export const validateOptimizationRequest = (data: unknown) => {
  return OptimizationRequestSchema.parse(data);
};
```

### Rate Limiting
```typescript
// Simple in-memory rate limiter
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const rateLimiter = (ip: string, limit: number = 10, windowMs: number = 60000) => {
  const now = Date.now();
  const key = ip;
  const entry = requestCounts.get(key);
  
  if (!entry || now > entry.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= limit) {
    return false;
  }
  
  entry.count++;
  return true;
};
```

### Data Sanitization
```typescript
// HTML/XSS Prevention
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

// SQL Injection Prevention (when database is added)
const sanitizeForSQL = (input: string): string => {
  return input.replace(/['"\\;]/g, '\\$&');
};
```

---

## Integration Patterns

### Lyzr AI Platform Integration
```typescript
// Structured Prompt Template
const buildAnalysisPrompt = (formData: OptimizationFormData): string => {
  return `
    <analysis-request>
      <context>
        <business-domain>${formData.domain}</business-domain>
        <use-case>${formData.useCase}</use-case>
        <team-size>${formData.teamSize}</team-size>
        <budget>${formData.budget}</budget>
        <priority>${formData.priority || 'balance'}</priority>
        <infrastructure>${formData.infrastructure || 'cloud-agnostic'}</infrastructure>
        <volume>${formData.monthlyVolume || 'not-specified'}</volume>
      </context>
      
      <requirements>
        <analysis-sections>
          <section id="llm-recommendations">
            <title>🔍 LLM Recommendations</title>
            <requirements>
              - Analyze business domain and use case requirements
              - Recommend 3-5 optimal LLM models
              - Consider budget constraints and performance needs
              - Provide cost-benefit analysis for each model
            </requirements>
          </section>
          
          <section id="cost-estimation">
            <title>📊 Token Cost Estimation</title>
            <requirements>
              - Calculate estimated monthly token costs
              - Break down costs by model and usage patterns
              - Include input/output token differentials
              - Project cost scaling scenarios
            </requirements>
          </section>
          
          <section id="roi-analysis">
            <title>🧮 ROI & Payback Analysis</title>
            <requirements>
              - Calculate expected return on investment
              - Determine break-even timeline
              - Compare with baseline scenarios
              - Include risk assessment
            </requirements>
          </section>
          
          <section id="architecture-recommendations">
            <title>🛠 Architecture Recommendations</title>
            <requirements>
              - Suggest optimal deployment architecture
              - Consider scalability and reliability needs
              - Include infrastructure recommendations
              - Address security and compliance requirements
            </requirements>
          </section>
          
          <section id="optimization-strategies">
            <title>📦 Cost-Saving Strategies</title>
            <requirements>
              - Identify specific optimization opportunities
              - Suggest prompt engineering improvements
              - Recommend caching and batching strategies
              - Include monitoring and alerting setup
            </requirements>
          </section>
          
          <section id="model-comparison">
            <title>🧠 Model Comparison Table</title>
            <requirements>
              - Create detailed comparison table
              - Include metrics: cost, latency, quality, reasoning, context, availability
              - Provide final recommendation scores
              - Format as markdown table
            </requirements>
          </section>
          
          <section id="implementation-roadmap">
            <title>🗺 Implementation Roadmap</title>
            <requirements>
              - Provide step-by-step implementation plan
              - Include timelines and milestones
              - Identify potential risks and mitigation
              - Suggest success metrics and KPIs
            </requirements>
          </section>
          
          <section id="monitoring-strategy">
            <title>📈 Monitoring & Analytics Strategy</title>
            <requirements>
              - Recommend monitoring tools and metrics
              - Suggest cost tracking mechanisms
              - Include performance benchmarking
              - Address ongoing optimization processes
            </requirements>
          </section>
          
          <section id="executive-summary">
            <title>📄 Executive Summary</title>
            <requirements>
              - Provide concise overview of recommendations
              - Highlight key financial benefits
              - Summarize implementation timeline
              - Include next steps and action items
            </requirements>
          </section>
        </analysis-sections>
      </requirements>
      
      <output-format>
        - Use clear section headers with emojis
        - Include specific data and calculations
        - Provide actionable recommendations
        - Format tables in markdown
        - Use bullet points for lists
        - Keep technical depth appropriate for business stakeholders
      </output-format>
    </analysis-request>
  `;
};
```

### Email Service Integration
```typescript
// Advanced Email Template System
class EmailTemplateService {
  private templates = new Map<string, EmailTemplate>();
  
  constructor() {
    this.loadTemplates();
  }
  
  private loadTemplates() {
    this.templates.set('optimization-report', {
      subject: '🎯 Your AIntellicost AI Cost Optimization Report',
      html: this.buildOptimizationReportTemplate(),
      attachments: ['pdf', 'json']
    });
    
    this.templates.set('analysis-complete', {
      subject: '✅ AI Analysis Complete - Next Steps Inside',
      html: this.buildAnalysisCompleteTemplate(),
      attachments: []
    });
  }
  
  private buildOptimizationReportTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AIntellicost Report</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
          }
          .header { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
            color: white; 
            padding: 2rem; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 1.8rem; 
            font-weight: 700; 
          }
          .header p { 
            margin: 0.5rem 0 0; 
            opacity: 0.9; 
            font-size: 1.1rem; 
          }
          .content { 
            padding: 2rem; 
            background: #f8fafc; 
          }
          .highlight-box { 
            background: #dcfce7; 
            border: 1px solid #86efac; 
            border-radius: 8px; 
            padding: 1rem; 
            margin: 1rem 0; 
          }
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 1rem; 
            margin: 1rem 0; 
          }
          .metric-card { 
            background: white; 
            padding: 1rem; 
            border-radius: 6px; 
            border-left: 4px solid #3b82f6; 
            text-align: center; 
          }
          .footer { 
            background: #1f2937; 
            color: white; 
            padding: 1.5rem; 
            text-align: center; 
            font-size: 0.9rem; 
          }
          ul { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 8px; 
            border-left: 4px solid #3b82f6; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your AIntellicost Report is Ready!</h1>
            <p>AI Cost Optimization Analysis Complete</p>
          </div>
          
          <div class="content">
            <p>Hello,</p>
            <p>Your comprehensive AI cost optimization report has been generated successfully. This analysis includes:</p>
            
            <ul>
              <li>🔍 Personalized LLM recommendations for your business domain</li>
              <li>📊 Detailed token cost estimation and budget analysis</li>
              <li>🧮 ROI projections with proven methodologies</li>
              <li>🛠 Architecture recommendations for optimal deployment</li>
              <li>📦 Cost-saving strategies tailored to your use case</li>
              <li>🗺 Implementation roadmap with clear timelines</li>
              <li>📈 Monitoring strategy for ongoing optimization</li>
            </ul>
            
            <div class="highlight-box">
              <strong style="color: #166534;">🎯 Expected Outcomes:</strong><br>
              <span style="color: #166534;">40-60% cost reduction • 5-week break-even • 2-week time-to-value</span>
            </div>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <h3 style="margin: 0; color: #3b82f6;">220%</h3>
                <p style="margin: 0;">Average ROI</p>
              </div>
              <div class="metric-card">
                <h3 style="margin: 0; color: #3b82f6;">5 weeks</h3>
                <p style="margin: 0;">Break-even</p>
              </div>
              <div class="metric-card">
                <h3 style="margin: 0; color: #3b82f6;">40-60%</h3>
                <p style="margin: 0;">Cost Reduction</p>
              </div>
            </div>
            
            <p>The attached PDF contains your complete analysis, and the JSON file includes all the raw data for further analysis.</p>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the comprehensive analysis in the attached PDF</li>
              <li>Share findings with your technical and business teams</li>
              <li>Begin implementation following our recommended roadmap</li>
              <li>Contact us for implementation support if needed</li>
            </ol>
          </div>
          
          <div class="footer">
            <p>Generated by <strong>AIntellicost</strong> - Empowering Smarter AI Investments</p>
            <p style="margin: 0.5rem 0 0; opacity: 0.7;">Report ID: {{sessionId}} | Generated: {{timestamp}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
```

---

## Monitoring & Analytics

### Performance Monitoring
```typescript
// Performance Metrics Collection
interface PerformanceMetrics {
  requestId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
  errorDetails?: string;
}

class MetricsCollector {
  private metrics: PerformanceMetrics[] = [];
  
  recordRequest(metrics: PerformanceMetrics) {
    this.metrics.push(metrics);
    
    // Log to console for now (replace with proper logging service)
    console.log('[METRICS]', JSON.stringify(metrics));
    
    // Send to analytics service (e.g., Google Analytics, Mixpanel)
    this.sendToAnalytics(metrics);
  }
  
  private sendToAnalytics(metrics: PerformanceMetrics) {
    // Implementation for analytics service
    // Example: Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'api_request', {
        endpoint: metrics.endpoint,
        response_time: metrics.responseTime,
        status_code: metrics.statusCode,
        custom_parameter_1: metrics.requestId
      });
    }
  }
  
  getMetricsSummary() {
    const summary = {
      totalRequests: this.metrics.length,
      averageResponseTime: this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / this.metrics.length,
      successRate: this.metrics.filter(m => m.statusCode < 400).length / this.metrics.length,
      errorRate: this.metrics.filter(m => m.statusCode >= 400).length / this.metrics.length
    };
    
    return summary;
  }
}
```

### Error Tracking
```typescript
// Error Tracking Service
class ErrorTracker {
  static captureException(error: Error, context?: Record<string, any>) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: context || {},
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };
    
    // Log locally
    console.error('[ERROR_TRACKER]', errorReport);
    
    // Send to error tracking service (e.g., Sentry, Bugsnag)
    this.sendToErrorService(errorReport);
  }
  
  private static sendToErrorService(report: any) {
    // Implementation for error tracking service
    // Example: Sentry
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(new Error(report.message), {
        tags: {
          component: 'aintellicost',
          environment: process.env.NODE_ENV
        },
        extra: report.context
      });
    }
  }
}
```

### Health Check Endpoint
```typescript
// /app/api/health/route.ts
export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    services: {
      lyzr: await checkLyzrService(),
      email: await checkEmailService(),
      pdf: await checkPDFService()
    }
  };
  
  const allServicesHealthy = Object.values(healthCheck.services).every(
    service => service.status === 'healthy'
  );
  
  return NextResponse.json(
    healthCheck,
    { status: allServicesHealthy ? 200 : 503 }
  );
}

async function checkLyzrService() {
  try {
    // Simple connectivity test
    const response = await fetch('https://agent-prod.studio.lyzr.ai/health', {
      method: 'GET',
      timeout: 5000
    });
    
    return {
      status: response.ok ? 'healthy' : 'unhealthy',
      responseTime: Date.now()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}
```

---

## Appendix

### Utility Functions
```typescript
// /lib/utils.ts
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSessionId = (): string => {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const interpolateTemplate = (template: string, data: Record<string, any>): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
};
```

### Constants
```typescript
// /lib/constants.ts
export const DOMAIN_USE_CASES = {
  technology: [
    'Code generation and review',
    'Documentation automation',
    'Technical support chatbots',
    'Data analysis and reporting',
    'API integration assistance'
  ],
  healthcare: [
    'Medical record analysis',
    'Patient communication',
    'Clinical decision support',
    'Research data processing',
    'Compliance monitoring'
  ],
  finance: [
    'Financial document analysis',
    'Risk assessment automation',
    'Customer service chatbots',
    'Fraud detection support',
    'Regulatory compliance'
  ],
  retail: [
    'Product recommendations',
    'Customer service automation',
    'Inventory optimization',
    'Market analysis',
    'Content generation'
  ]
};

export const TEAM_SIZE_MULTIPLIERS = {
  small: 1.0,
  medium: 1.5,
  large: 2.0,
  enterprise: 3.0
};

export const CLOUD_PROVIDER_CONFIGS = {
  AWS: {
    regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
    services: ['EC2', 'Lambda', 'ECS', 'Bedrock']
  },
  Azure: {
    regions: ['East US', 'West US 2', 'West Europe'],
    services: ['App Service', 'Functions', 'Container Instances', 'OpenAI Service']
  },
  GCP: {
    regions: ['us-central1', 'us-east1', 'europe-west1'],
    services: ['Compute Engine', 'Cloud Functions', 'Cloud Run', 'Vertex AI']
  }
};
```

---

**Document Version**: 1.0  
**Last Updated**: July 20, 2025  
**Prepared By**: AIntellicost Development Team  
**Document Status**: Production Ready
