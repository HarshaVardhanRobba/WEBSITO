# Websito: AI-Powered Code Generation Platform

A full-stack SaaS application that generates production-grade Next.js websites from natural language prompts using agentic AI with real-time code execution and interactive previews.

---

## 1. Problem Statement

Building production-ready websites is time-consuming: developers must write boilerplate, design UI systems, integrate auth, set up styling, and manage complex component architecture. Manual iteration cycles delay delivery.

**The Solution:** An AI-powered platform that:
- Accepts natural language requirements and generates complete, functioning Next.js applications
- Executes code in isolated sandboxes (E2B) to validate output in real-time
- Provides interactive previews with hot-reload capabilities
- Leverages multi-turn agentic workflows to iteratively refine outputs
- Implements usage-based billing with rate limiting on API calls

---

## 2. System Architecture

### Core Processing Pipeline

```
User Input (tRPC)
    ↓
[Clerk Authentication + Rate Limiter]
    ↓
tRPC Server (messages.create, projects.create)
    ↓
Inngest Event Queue (code-agent/run)
    ↓
┌─────────────────────────────────────┐
│  AI Agent Network (Gemini 2.0 Flash)│
├─────────────────────────────────────┤
│ • Code Agent (Multi-turn Agent)     │
│ • System Prompt (Frontend Rules)    │
│ • Tool Execution (Terminal/Files)   │
│ • Max Iterations: 20                │
└─────────────────────────────────────┘
    ↓
E2B Sandbox (Isolated Execution)
    ├─ Terminal: Execute build commands
    ├─ Files: Create/update Next.js files
    └─ Preview: Host on dynamic URL
    ↓
[Error Handling / Validation]
    ↓
Prisma ORM + PostgreSQL
    ├─ Save Messages (User/Assistant)
    ├─ Store Fragment (Code + Preview URL)
    └─ Track Usage Credits
    ↓
Response to Frontend (React Query + tRPC)
```

### Component Interactions

**Authentication Layer:**
- Clerk handles user identity and plan differentiation
- Free vs Pro users have different credit limits (10 vs 100 points per 30 days)

**Async Job Processing:**
- Inngest orchestrates the entire code generation workflow
- Enables long-running operations (up to 30min+ sandbox time)
- Provides automatic retries and error recovery

**Database Relationships:**
```
User (Clerk) → Project (1..N)
Project → Message (1..N)
Message → Fragment (0..1)
Fragment contains: sandboxUrl, files (JSON), title
```

---

## 3. Tech Stack

### Backend & Infrastructure
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 18+ (Next.js 16 runtime) | Server-side execution |
| **Framework** | Next.js 16.0.1 + App Router | Full-stack SSR/API routes |
| **API** | tRPC 11.7.1 (RPC) | Type-safe API with React integration |
| **LLM** | Gemini 2.0 Flash / X.AI | Core code generation model |
| **Agent Orchestration** | Inngest 3.45.1 | Workflow engine for agent networks |
| **Agent SDK** | @inngest/agent-kit 0.13.2 | Multi-agent framework + tool system |
| **Code Execution** | E2B Code Interpreter v2.2.0 | Isolated sandbox for Next.js builds |
| **Database** | PostgreSQL (Neon) | Persistent storage |
| **ORM** | Prisma 6.19.0 + Accelerate | Type-safe DB access with connection pooling |
| **Auth** | Clerk 6.35.4 | User identity & org management |
| **Rate Limiting** | rate-limiter-flexible 8.3.0 | Credit-based usage tracking |

### Frontend
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 19.2.0 | Component rendering |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Components** | Shadcn UI | Accessible, customizable components |
| **Icons** | Lucide React 0.552.0 | SVG icons |
| **State Management** | TanStack React Query 5.90.8 | Server state + caching |
| **Type System** | TypeScript 5.9.3 | Type safety |
| **Forms** | React Hook Form 7.66.0 + Zod | Form validation |
| **Animation** | Framer Motion 12.23.24 | Motion primitives |
| **Code Display** | Prism.js 1.30.0 | Syntax highlighting |

### DevOps & Build
| Component | Technology |
|-----------|-----------|
| **Build Tool** | Turbopack (Next.js) |
| **Linting** | ESLint 9 |
| **Data Transform** | SuperJSON 2.2.5 |

---

## 4. Key Features (Technical)

### 4.1 Multi-Turn Agentic Code Generation
- **Agent Network:** Inngest creates a network of agents with routing logic
- **Max Iterations:** 20-turn limit prevents infinite loops
- **Tool System:** Sandboxed tools for terminal execution and file operations
- **State Management:** Agent state tracks file artifacts and summaries

**Implementation:**
```typescript
// Three core tools available to agent
createTool("terminal")     // Execute npm, build commands
createTool("createOrUpdateFiles")  // Write code to sandbox  
createTool("readfiles")    // Inspect generated files
```

### 4.2 Isolated Sandbox Execution
- **E2B Runtime:** Pre-configured Next.js 15 environment per sandbox instance
- **Templated Setup:** Custom Dockerfile with Node, npm, and build dependencies
- **Dynamic Hosting:** Each sandbox gets a unique HTTPS preview URL
- **File Persistence:** All generated files tracked in Fragment model

**Execution Flow:**
```
Sandbox.create() → sandboxId
→ Agent runs tools in sandbox context
→ sandbox.commands.run() executes terminal
→ sandbox.files.write() creates code artifacts
→ sandbox.getHost(3000) → HTTPS preview URL
```

### 4.3 Real-Time Streaming & Long-Running Jobs
- **Inngest Workflows:** Handles 20+ minute builds without timeout
- **Step Functions:** Granular error tracking per operation
- **Webhooks:** Sandbox lifecycle events trigger database updates

### 4.4 Usage-Based Billing & Rate Limiting
- **Credit System:** Each generation consumes 1 credit
- **Free Tier:** 10 credits / 30 days per user
- **Pro Tier:** 100 credits / 30 days
- **Enforcement:** Checked before project/message creation

**Implementation:**
```typescript
consumeCredits() // Throws if user exceeds limit
await prisma.usage.deleteMany() // Reset on upgrade
```

### 4.5 Type-Safe API with tRPC
- **End-to-End Types:** Frontend has full type inference on API
- **Middleware:** Authentication checks before procedure execution
- **Routers:** Modular separation (messages, projects, usage)
- **SuperJSON:** Custom serialization for complex types

**Available Endpoints:**
- `messages.getMany(projectId)` → Stream of User/Assistant messages
- `messages.create(projectId, value)` → Trigger code generation
- `projects.getOne(id)` → Single project details
- `projects.getMany()` → User's projects list
- `projects.create(value)` → New project with embedded message
- `usage.*` → Credit checking endpoints

### 4.6 Database Schema & Relationships
```sql
Project
├─ id (UUID)
├─ userId (from Clerk)
├─ name (auto-generated slug)
└─ messages → Message[]

Message
├─ id (UUID)
├─ content (user input / AI response)
├─ role (USER | ASSISTANT)
├─ type (RESULT | ERROR)
├─ projectId → Project
└─ fragment → Fragment (optional)

Fragment
├─ id (UUID)
├─ messageId → Message (1:1)
├─ sandboxUrl (HTTPS preview)
├─ files (JSON blob of file paths → content)
└─ title (display name)

Usage (Rate Limiting)
├─ key (ratelimit:userId or ratelimit:pro:userId)
├─ points (consumed credits)
└─ expire (TTL for record)
```

---

## 5. Performance & Evaluation

### Metrics & Benchmarks

| Metric | Target | Notes |
|--------|--------|-------|
| **Generation Time** | 30-90 seconds | Sandbox startup (5-10s) + agent loops (20-80s) |
| **Sandbox Pool** | Cold start: ~8-12s | E2B pre-warmed templates reduce latency |
| **Agent Iterations** | Avg 8-12 loops | Self-stops when task_summary detected |
| **API Response (tRPC)** | <100ms | Direct DB queries, no external calls |
| **Database Queries** | Single-digit ms | PostgreSQL on Neon cluster |
| **Preview URL Generation** | <5s | Sandbox getHost() call |

### Scalability Considerations

1. **Inngest Queue:** Handles 1000s of concurrent workflows (distributed)
2. **Prisma Accelerate:** Connection pooling prevents DB exhaustion
3. **E2B Sandboxes:** Parallel execution (regional data centers)
4. **Rate Limiter:** In-database counters allow horizontal scaling
5. **Bottleneck:** Per-user sandbox creation (E2B quota limits)

### Evaluation Criteria

**Code Quality:**
- Generated code passes Next.js strict mode (App Router only)
- Uses Shadcn UI component library (pre-vetted components)
- Tailwind classes validated against config
- TypeScript strict mode enabled

**User Experience:**
- Real-time preview URL hosted within seconds
- Interactive fragment viewer with syntax highlighting
- Multi-turn conversation history preserved per project
- Theme persistence (localStorage for dark/light)

---

## 6. Folder Structure

```
websito/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   ├── inngest/route.ts      # Inngest webhook handler
│   │   │   └── trpc/[trpc]/route.ts  # tRPC API endpoint
│   │   ├── (home)/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── pricing/              # Pricing page
│   │   │   ├── sign-in/              # Clerk auth
│   │   │   └── sign-up/              # Clerk auth
│   │   ├── projects/[projectId]/     # Project view
│   │   ├── globals.css               # Tailwind imports
│   │   └── layout.tsx                # Root layout
│   │
│   ├── inngest/                      # Async orchestration
│   │   ├── client.ts                 # Inngest singleton
│   │   ├── functions.ts              # Code agent workflow (208 lines)
│   │   ├── server.ts                 # (optional server utils)
│   │   └── utils.ts                  # getSandbox(), lastMessage()
│   │
│   ├── trpc/                         # RPC framework
│   │   ├── init.ts                   # tRPC context + middleware
│   │   ├── client.tsx                # React client setup
│   │   ├── server.tsx                # Server provider wrapper
│   │   ├── quert-client.ts           # React Query config
│   │   └── routes/
│   │       └── _app.ts               # Router aggregation
│   │
│   ├── modules/                      # Feature-based structure
│   │   ├── projects/
│   │   │   ├── server/
│   │   │   │   └── procedures.ts     # tRPC project mutations
│   │   │   └── UI/                   # Project components
│   │   ├── messages/
│   │   │   ├── server/
│   │   │   │   └── procedures.ts     # tRPC message queries
│   │   │   └── UI/
│   │   │       ├── message-card.tsx
│   │   │       ├── message-container.tsx
│   │   │       ├── Fragment-web.tsx  # Preview iframe
│   │   │       └── project-view.tsx
│   │   ├── usage/
│   │   │   └── server/
│   │   │       └── procedures.ts     # Credit status
│   │   └── home/
│   │       └── ui/                   # Landing components
│   │
│   ├── components/
│   │   ├── ui/                       # 30+ Shadcn components
│   │   │   ├── button.tsx, dialog.tsx, tabs.tsx, etc.
│   │   ├── file-explorer.tsx         # File sidebar
│   │   ├── tree-view.tsx             # Recursive file tree
│   │   ├── code-view/
│   │   │   ├── index.tsx             # Code viewer
│   │   │   └── code-theme.css        # Prism theme
│   │   ├── user-control.tsx          # Auth dropdown
│   │   └── hint.tsx                  # Tooltips
│   │
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma singleton + Accelerate
│   │   ├── usage.ts                  # Rate limiter setup
│   │   └── utils.ts                  # Tailwind merge, classname helpers
│   │
│   ├── hooks/
│   │   ├── use-current-theme.ts      # Theme context
│   │   ├── use-mobile.ts             # Responsive hook
│   │   └── use-scroll.ts             # Scroll position tracking
│   │
│   ├── generated/
│   │   └── prisma/
│   │       ├── client.ts             # Auto-generated Prisma types
│   │       └── index.ts
│   │
│   ├── prompt.ts                     # System prompt for agent (117 lines)
│   ├── types.ts                      # TypeScript type definitions
│   └── proxy.ts                      # Clerk middleware config
│
├── prisma/
│   ├── schema.prisma                 # Database models
│   ├── seed.ts                       # (optional) DB seeding
│   └── migrations/
│       ├── migration_lock.toml
│       ├── 20251115040348_message_model/
│       ├── 20251116230526_model_projects/
│       ├── 20251123053446_add_user_id_to_project/
│       └── 20251127200631_usage_model/
│
├── sandbox-templates/
│   └── nextjs/
│       ├── e2b.toml                  # E2B template config
│       ├── e2b.Dockerfile            # Sandbox environment
│       └── compile_page.sh            # Build entrypoint
│
├── public/                           # Static assets
├── next.config.ts                    # Next.js config (minimal)
├── tsconfig.json                     # TypeScript strict mode
├── package.json                      # Dependencies (specified above)
├── prisma.config.ts                  # (if applicable)
├── components.json                   # Shadcn config
├── eslint.config.mjs                 # Linting rules
└── postcss.config.mjs                # Tailwind PostCSS

Key Directories by Concern:
• Backend Logic: src/inngest/, src/modules/*/server/
• Frontend UI: src/components/, src/modules/*/UI/
• Type Safety: src/generated/prisma/, tsconfig.json
• Database: prisma/schema.prisma, src/lib/prisma.ts
• Async Jobs: src/inngest/functions.ts (core 208 lines)
```

---

## 7. Future Improvements & Assumptions

### 7.1 Architectural Improvements

**Multi-Agent Specialization**
- Separate agents for design, backend logic, and testing phases
- Router logic to coordinate handoffs (e.g., design-agent → backend-agent)
- Reduced hallucination through decomposed responsibilities

**Streaming Responses**
- WebSocket-based real-time progress updates
- Agent iteration logs visible to frontend during generation
- Cancellation mechanism to stop long-running workflows

**Advanced Sandbox Features**
- Persistent sandbox state across multiple requests (conversation context)
- GPU access for ML model deployments
- Database sandboxes (PostgreSQL per user) for full-stack testing

### 7.2 Performance & Scalability

**Caching Layer**
- Cache generated components (Vercel KV for user templates)
- Memoize agent decisions based on prompt similarity
- Reduce redundant Gemini API calls via semantic caching

**Database Optimization**
- Add indexes on (userId, createdAt) for project queries
- Archive old messages/fragments to cold storage (S3)
- Read replicas for analytics queries

**E2B Sandbox Pooling**
- Pre-warm sandbox pool for instant activation
- Reuse sandboxes across multiple requests for same user (sessions)
- Monitor E2B quotas and implement queue backpressure

### 7.3 Feature Expansion

**Collaboration & Version Control**
- Shared projects with role-based access (RBAC)
- Git integration for design history and branching
- Diff view between generations (code comparison)

**Advanced LLM Capabilities**
- Vision model for design-from-screenshot feature
- Long-context models (200K+ tokens) for large codebases
- Function calling for deterministic tool invocation

**Audit & Observability**
- OpenTelemetry integration for distributed tracing
- Inngest workflow dashboard for job monitoring
- User activity logs (who generated what, when)
- Cost tracking per user (token consumption → billing)

### 7.4 Security & Compliance

**Sandbox Isolation**
- Network policies to prevent sandbox-to-internet leakage
- Container image scanning for vulnerabilities
- Resource limits (CPU, RAM, disk) per sandbox instance

**Data Privacy**
- End-to-end encryption for code artifacts (at rest)
- GDPR compliance: data deletion workflows
- PII detection and masking in prompts/responses

**API Security**
- Rate limiting per IP (DDoS mitigation)  
- CORS policies aligned with frontend domain
- API key rotation for E2B and Gemini credentials
- Secret scanning in CI/CD pipeline

### 7.5 Business Model Evolution

**Tiered Tier Structure**
- Starter: 10 credits/month + limited sandbox time (5min)
- Pro: 100 credits/month + priority queue
- Enterprise: Custom credits + dedicated sandbox pool + SLA

**Pay-Per-Use Alternative**
- Token-based consumption model (align with LLM pricing)
- Overage pricing for users exceeding monthly limits

**Add-On Services**
- Managed hosting (deploy generated sites to Vercel)
- Custom domain mapping
- CI/CD pipeline generation for GitHub/GitLab

### 7.6 Assumptions & Constraints

**Current Assumptions:**
1. **Sandboxes are stateless:** Each generation creates new sandbox (no persistent context)
2. **Prompt is universal:** All users get same system prompt (no personalization)
3. **Single LLM model:** Only Gemini 2.0 Flash (fallback to X.AI)
4. **Synchronous workflow:** Frontend waits for Inngest completion (HTTP long-polling implied)
5. **No team/org feature:** Projects tied directly to individual user (Clerk userId)

**Technical Constraints:**
- E2B template version: Lovable1-nextjs-Harsha (hardcoded)
- Max agent iterations: 20 (prevents infinite loops but may cut off complex tasks)
- Sandbox timeout: Inngest default (typically 30 min)
- Database connection limit: Neon pooler limits (e.g., 25 connections)
- Preview URL lifetime: Tied to sandbox lifetime (ephemeral)

**Edge Cases to Handle:**
1. Agent gets stuck in loop → Max iterations stop it (error message to user)
2. Sandbox build fails → Caught in error handler, saved as MESSAGE type ERROR
3. User cancels mid-generation → Inngest step runs to completion (no true cancellation)
4. Rate limiter expires record → Recalculates from database (race condition possible)
5. Prisma Accelerate outage → Connection pools degrade, errors propagate to frontend

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon connection string)
- Gemini API key or X.AI API key
- Clerk account (auth)
- E2B account (sandboxes)

### Setup
```bash
npm install
npx prisma migrate deploy
npm run dev
```

### Environment Variables
```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
INNGEST_API_KEY=...
INNGEST_EVENT_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
E2B_API_KEY=...
```

---

## Deployment

**Recommended:** Vercel + Neon PostgreSQL + E2B Cloud

See [Next.js Deployment Docs](https://nextjs.org/docs/deployment) for CI/CD setup.
