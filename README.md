# ⚡ Trace

> **The Intelligent DSA Revision Engine & Problem Bank — Master Data Structures & Algorithms through Spaced Repetition.**

[![Live App](https://img.shields.io/badge/Live_App-traceio.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://traceio.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-15.5_(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis_Rate_Limiter-00E699?style=flat-square&logo=redis)](https://upstash.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better--Auth-orange?style=flat-square)](https://www.better-auth.com/)

---

## 🌐 Live Application

Access the live platform directly: **[traceio.vercel.app](https://traceio.vercel.app)**

---

## 📌 Overview

**Trace** is a developer-first revision engine designed to solve the single biggest obstacle in technical interview preparation: **forgetting DSA concepts weeks after solving them**.

Grinding hundreds of LeetCode problems yields diminishing returns if the core intuition behind a Topological Sort, Monotonic Stack, or Dynamic Programming pattern fades before your technical interview loops. Trace replaces passive spreadsheets and messy bookmarks with an **active Spaced Repetition workflow**. By dynamically scheduling problem reviews based on your individual recall strength, Trace turns temporary problem solving into permanent algorithmic intuition.

Equipped with an embedded **Monaco Code Editor**, automatic **LeetCode metadata extraction**, structured **interview debrief templates**, and an **Edge defense perimeter** powered by Upstash Redis, Trace is built for candidates targeting Tier-1 product companies.

---

## 🚀 Key Features

### 🧠 1. Intelligent DSA Spaced Repetition Engine
* **Automated Revision Queue:** Eliminates guesswork by calculating the exact date you should revisit each problem before the pattern fades from memory.
* **4-Tier Recall Evaluation:**
  * **Again:** Complete blank or hit a dead end $\rightarrow$ re-queues immediately for the next day.
  * **Hard:** Solved with hints or noticeable struggle $\rightarrow$ short interval increase.
  * **Medium:** Solid recall with clean logic and target complexity $\rightarrow$ standard spaced interval.
  * **Easy:** Instant pattern recognition and optimal code $\rightarrow$ extended review interval.
* **Focus on Weak Spots:** Directs 80% of your prep time toward the exact DSA patterns you are in danger of forgetting, rather than re-solving problems you've already mastered.

### 📝 2. High-Yield Technical Debrief Notes
* Comprehensive problem log schema capturing critical interview dimensions:
  * **Brute Force vs. Optimal Solution:** Compare naive implementations with target asymptotic bounds.
  * **Asymptotic Complexities:** Explicit Time Complexity $O(T)$ and Space Complexity $O(S)$ tracking.
  * **Pitfalls & Edge Cases:** Log common off-by-one errors, integer overflows, or boundary oversights.
  * **Core Intuition & Verbal Walkthrough:** Formulate structured explanations tailored for FAANG / Tier-1 hiring loops.
  * **Embedded Monaco Editor:** In-browser syntax-highlighted editor for instant code snippet reference.

### 🌐 3. Multi-Platform DSA Tracker
* Centralize your problem-solving journey across top coding platforms:
  * **LeetCode** (Automatic problem metadata fetching & slug resolution)
  * **Codeforces**
  * **CodeChef**
  * **GeeksforGeeks (GFG)**
  * **HackerRank**

### 🛡️ 4. Production Edge Defense & Rate Limiting
* **Zero-Cost Edge Bot Sieve:** Intercepts traffic at Vercel Edge before hitting DB or Redis. Immediately blocks automated scrapers and bots (`curl`, `python`, `wget`, `node`, `axios`, `postman`, etc.) with `403 Forbidden`.
* **3-Tier Upstash Redis Sliding Window:**
  * **Sensitive Limiter (`10 req / 60s`):** Shields `/login`, `/api/auth/*`, and `/api/leetcode` scraping against abuse.
  * **Mutation Limiter (`30 req / 60s`):** Limits state-modifying operations (`POST`, `PUT`, `DELETE`, `PATCH`).
  * **Read Limiter (`50 req / 60s`):** Throttles standard page navigation and API reads.
* **Fail-Open Resilience:** Built-in fallbacks guarantee legitimate users are never blocked during upstream network or Redis blips.

### 🎨 5. High-Performance Glassmorphic UI
* Dark-mode interface crafted with **Tailwind CSS v4** and OKLCH color spaces.
* Hardware-accelerated 3D visuals using **Three.js** and **OGL**.
* Butter-smooth inertial page scrolling powered by **Lenis**.
* Micro-interactions and layout transitions driven by **Motion**.

---

## 🎯 Master Core DSA Patterns

Trace is optimized for tracking high-frequency interview patterns across all major DSA domains:

| Category | High-Frequency Patterns Tracked |
| :--- | :--- |
| **Arrays & Hashing** | Two Pointers, Sliding Window, Prefix Sums, Kadane's Algorithm |
| **Stacks & Queues** | Monotonic Stack, Next Greater Element, Min Stack |
| **Linked Lists** | Fast & Slow Pointers (Floyd's Cycle), In-place Reversal, Merge K Lists |
| **Trees & BST** | DFS/BFS Traversal, LCA, Tree Diameter, Path Sum, BST Properties |
| **Graphs** | BFS/DFS, Dijkstra, Bellman-Ford, Topological Sort, Disjoint Set Union (DSU) |
| **Dynamic Programming** | 1D Memoization, 0/1 Knapsack, Longest Common Subsequence, Grid Paths, Interval DP |
| **Binary Search** | Search on Answer Space, Rotated Sorted Array, Peak Element |
| **Heaps & Greedy** | Top K Frequent Elements, Kth Largest, Median Finder, Interval Scheduling |

---

## 🏗️ Architecture & Data Flow

```text
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
       │   • DSA Problem CRUD & Debrief Note Storage             │
       │   • Spaced Repetition Scheduling Engine                 │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │       PostgreSQL Database     │
                    │   (Prisma 7 Client & Adapter) │
                    └───────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & OKLCH design tokens |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Edge Cache & Limiting** | [Upstash Redis](https://upstash.com/) (`@upstash/ratelimit`, `@upstash/redis`) |
| **Authentication** | [Better-Auth](https://www.better-auth.com/) (OAuth: GitHub, Google + Credentials) |
| **Graphics & Motion** | [Three.js](https://threejs.org/), [OGL](https://github.com/oframe/ogl), [Motion](https://motion.dev/), [Lenis](https://lenis.darkroom.engineering/) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) |
| **Validation** | [Zod 4](https://zod.dev/) |

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
