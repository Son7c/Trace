# ⚡ Trace

> **Intelligent Spaced Repetition (SM-2) & High-Yield Technical Problem Bank for Competitive Programming and Technical Interview Prep.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5_(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis_Rate_Limiter-00E699?style=flat-square&logo=redis)](https://upstash.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better--Auth-orange?style=flat-square)](https://www.better-auth.com/)

---

## 📌 Overview

**Trace** is a developer-centric revision engine engineered to conquer the Ebbinghaus forgetting curve for algorithmic problem solving. While traditional trackers treat problem logs as passive checklists, Trace applies the **SuperMemo SM-2 Spaced Repetition algorithm** to dynamically schedule problem reviews based on cognitive recall difficulty, ensuring deep retention of core algorithmic patterns (Trees, Graphs, DP, Monotonic Stacks, Sliding Window).

Trace combines a fluid dark-mode glassmorphic interface, embedded **Monaco Editor**, real-time **LeetCode metadata extraction**, and an **Edge-grade perimeter defense** powered by Upstash Redis sliding window limiters and zero-cost bot sieves.

---

## 🚀 Key Features

### 🧠 1. SuperMemo SM-2 Spaced Repetition Algorithm
* **Algorithmic Review Intervals:** Schedules reviews at optimal intervals ($I_1 = 1\text{ day}$, $I_2 = 6\text{ days}$, $I_n = I_{n-1} \times EF$).
* **Dynamic Ease Factor ($EF$):** Automatically adjusts problem difficulty multipliers using qualitative feedback tiers:
  * `AGAIN` ($Q = 0$): Complete memory lapse; resets interval to 1 day.
  * `HARD` ($Q = 3$): Successful recall with substantial effort; decreases $EF$.
  * `MEDIUM` ($Q = 4$): Good recall after slight hesitation; stabilizes $EF$.
  * `EASY` ($Q = 5$): Instantaneous, perfect recall; accelerates $EF$ progression.
* **Minimum Floor Safety:** Enforces an absolute lower bound of $EF = 1.3$ to prevent perpetual scheduling stagnation.

### 🛡️ 2. Production Edge Defense & Bot Mitigation
* **Zero-Cost Edge Bot Sieve:** Intercepts incoming requests at Vercel Edge before invoking application logic, database connections, or Redis operations. Immediately drops non-browser User-Agents (`curl`, `python`, `wget`, `node`, `axios`, `postman`, `httpie`, `insomnia`) with `403 Forbidden`.
* **3-Tier Sliding Window Rate Limiting (Upstash Redis):**
  * **Sensitive Limiter (`10 req / 60s`):** Guards `/login`, `/api/auth/*`, and third-party `/api/leetcode` scraping endpoints against brute force and DDoS.
  * **Mutation Limiter (`30 req / 60s`):** Limits state-modifying operations (`POST`, `PUT`, `DELETE`, `PATCH`).
  * **Read Limiter (`50 req / 60s`):** Throttles standard page navigation and API reads.
* **Fail-Open Fault Tolerance:** Wrapped in resilient `try/catch` fallbacks to ensure legitimate traffic is never blocked during upstream Redis outages or quota depletion.

### 📝 3. Structured Technical Interview Debrief
* Comprehensive problem log schema capturing critical technical dimensions:
  * **Brute Force vs. Optimal Solution:** Contrast naive implementations with target asymptotic bounds.
  * **Asymptotic Complexities:** Explicit Time $O(T)$ and Space $O(S)$ complexity tracking.
  * **Pitfalls & Edge Cases:** Catalog common off-by-one errors, memory overflows, or boundary oversights.
  * **Core Intuition & Interview Walkthrough:** Formulate structured verbal explanations tailored for FAANG / Tier-1 hiring loops.
  * **Embedded Monaco Editor:** In-browser syntax-highlighted code editor for instant code snippet reference.

### 🌐 4. Multi-Platform Support & Ingestion
* Built-in classification and metadata ingestion across major coding platforms:
  * **LeetCode** (Direct metadata scraping & title slug resolution)
  * **Codeforces**
  * **CodeChef**
  * **GeeksforGeeks**
  * **HackerRank**

### 🎨 5. High-Fidelity User Experience
* Modern dark-themed glassmorphism interface built with **Tailwind CSS v4** and OKLCH color spaces.
* Hardware-accelerated 3D visuals using **Three.js** and **OGL**.
* Butter-smooth inertial page scrolling powered by **Lenis**.
* Micro-interactions and layout transitions driven by **Motion**.

---

## 📐 Mathematical Formulation: The SM-2 Algorithm

Trace implements the validated SuperMemo SM-2 algorithm:

```math
EF' = EF + (0.1 - (5 - Q) \times (0.08 + (5 - Q) \times 0.02))
```

```math
I(n) = \begin{cases} 
1 & \text{if } n = 1 \\ 
6 & \text{if } n = 2 \\ 
\operatorname{round}(I(n-1) \times EF') & \text{if } n > 2 
\end{cases}
```

Where:
* $Q \in \{0, 3, 4, 5\}$ denotes the review quality response.
* $EF$ is the current Ease Factor (initialized to $2.5$, with $EF \ge 1.3$).
* $n$ denotes the consecutive successful revision count. If $Q < 3$, $n$ is reset to $0$ and the interval reverts to $1\text{ day}$.

---

## 🏗️ Architecture & Data Model

```
                    ┌───────────────────────────────┐
                    │      Client / User Agent      │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             Next.js Edge Middleware (Vercel)            │
       │                                                         │
       │  [Step 1] Zero-Cost Bot Sieve (Drop curl, python, etc.) │
       │  [Step 2] Upstash Redis 3-Tier Sliding Window Limiter   │
       │  [Step 3] Session Verification & Route Guarding         │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             Next.js 15 App Router Backend               │
       │                                                         │
       │   • Better-Auth Session Management                      │
       │   • Problem CRUD & Note Storage                         │
       │   • SM-2 Engine Calculation (/lib/sm2.ts)               │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │       PostgreSQL (Neon)       │
                    │   (Prisma 7 Client & Adapter) │
                    └───────────────────────────────┘
```

### Core Schema Relationships (`prisma/schema.prisma`):
* **`User`** $\rightarrow$ Has many `Problem`, `Session`, and `Account` records.
* **`Problem`** $\rightarrow$ Tracks platform, URL, difficulty, tags, $EF$, $n$, and `nextRevisionDate`.
* **`Note`** $\rightarrow$ $1:1$ with `Problem`; stores technical approaches, complexities, mistakes, and intuition.
* **`RevisionLog`** $\rightarrow$ $1:N$ with `Problem`; captures historical review timestamps and feedback.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & OKLCH variables |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Edge Cache & Limiting** | [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit`, `@upstash/redis`) |
| **Authentication** | [Better-Auth](https://www.better-auth.com/) (OAuth: GitHub, Google + Credentials) |
| **Graphics & Motion** | [Three.js](https://threejs.org/), [OGL](https://github.com/oframe/ogl), [Motion](https://motion.dev/), [Lenis](https://lenis.darkroom.engineering/) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) |
| **Validation** | [Zod 4](https://zod.dev/) |

---

## 📂 Directory Structure

```text
Trace/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/          # Better-Auth authentication endpoints
│   │   ├── leetcode/               # LeetCode problem scraping & metadata API
│   │   └── problems/               # Problem CRUD, notes, and revision APIs
│   │       ├── [id]/note/          # Detailed debrief notes handler
│   │       ├── [id]/revision/      # SM-2 feedback & schedule updater
│   │       └── reviews/            # Due review queue retriever
│   ├── dashboard/                  # Analytics dashboard & retention stats
│   ├── login/                      # Authentication portal
│   ├── problems/                   # Problem library and search engine
│   │   └── [id]/                   # Full problem breakdown & debrief note
│   ├── profile/                    # User settings & active session management
│   ├── review/                     # Interactive spaced repetition review deck
│   ├── layout.tsx                  # Root application layout
│   └── page.tsx                    # Landing page with 3D canvas & hero
├── components/                     # Reusable glassmorphic UI components
├── lib/
│   ├── auth.ts                     # Better-Auth server configuration
│   ├── auth-client.ts              # Better-Auth React client hooks
│   ├── prisma.ts                   # Prisma client singleton instance
│   ├── sm2.ts                      # SuperMemo SM-2 algorithm calculation
│   └── validators/                 # Zod validation schemas
├── prisma/
│   └── schema.prisma               # Database models, relations, and enums
├── public/                         # Static assets and icons
├── middleware.ts                   # Edge bot sieve, 3-tier rate limiter, auth guards
├── package.json
└── tsconfig.json
```

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js**: `v20.x` or later
* **Package Manager**: `pnpm` (recommended) or `npm`
* **PostgreSQL Database**: Local or hosted (e.g., [Neon](https://neon.tech/))
* **Upstash Redis**: Serverless Redis database ([Upstash](https://upstash.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Son7c/Trace.git
cd Trace
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```bash
cp .env.example .env
```

Populate the required keys:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trace?schema=public"

# Authentication
BETTER_AUTH_SECRET="your-32-char-random-secret"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Credentials
GITHUB_CLIENT_ID="your-github-oauth-id"
GITHUB_CLIENT_SECRET="your-github-oauth-secret"
GOOGLE_CLIENT_ID="your-google-oauth-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

### 4. Setup Database
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```

Generate the Prisma Client:
```bash
npx prisma generate
```

### 5. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Rate Limiting Overview

| Route Pattern | Limiter Tier | Limit Window | Target Scenario |
| :--- | :--- | :--- | :--- |
| `/login`, `/api/auth/*`, `/api/leetcode` | `sensitiveLimiter` | 10 requests / 60s | Credential stuffing & scraper abuse |
| `/api/*` (`POST`, `PUT`, `DELETE`, `PATCH`) | `mutationLimiter` | 30 requests / 60s | Spam submissions & database mutations |
| All other pages / routes | `readLimiter` | 50 requests / 60s | General traffic & browsing |
| Automated Scrapers / Bots | Edge Bot Sieve | Immediate Drop (`403`) | Zero-cost protection against malicious crawlers |

---

## 📄 License

This project is licensed under the MIT License.
