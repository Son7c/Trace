# 🚀 Trace MVP Launch - Master Execution Roadmap

Follow these tasks sequentially to complete the **Trace** MVP for production launch.

---

## 📋 Build Order Checklist

### 1️⃣ Phase 1: Navigation & Missing Routes
- [x] **Task 1: Build User Profile Page**
  - **File:** `app/profile/page.tsx`
  - [x] Handle session authentication with `authClient.useSession()`.
  - [x] Display user profile card (Avatar, Name, Email, Joined date).
  - [x] Show overall retention stats (Total problems logged, total revisions completed, Memory Score, Active Streak).
  - [x] Topic Mastery breakdown with progress bars by tag (Arrays, Trees, Graphs, DP).
  - [x] Platform & Difficulty breakdown.
  - [x] Add Logout button with redirect to `/`.
  - [x] Apply dark glassmorphism styling (`bg-neutral-950 text-white`).

---

### 2️⃣ Phase 2: Main Dashboard Experience
- [ ] **Task 2: Redesign Main Dashboard**
  - **File:** `app/dashboard/page.tsx`
  - [ ] Upgrade layout to dark glassmorphism (`bg-neutral-950 text-slate-100`).
  - [ ] Add Top Metric Cards:
    - 🎯 **Due Today** (Actionable review count)
    - 📚 **Total Problems** (Repository size)
    - ⚡ **Memory Score** (Average Ease Factor / Retention rate)
    - 🔥 **Active Streak** (Daily review streak)
  - [ ] Build **Today's Target Queue** section rendering styled `ReviewCard` items with direct links to `/review`.
  - [ ] Render floating `Dock` component at the bottom of the page.

---

### 3️⃣ Phase 3: Interactive Review Deck (Flashcards)
- [ ] **Task 3: Upgrade Flashcard Review Mode**
  - **Files:** `app/review/page.tsx`, `components/reviews/ReviewSession.tsx`, `components/reviews/ReviewCompleted.tsx`
  - [ ] Add card progress header (`Card X of Y` + visual progress bar).
  - [ ] Add difficulty badges (Easy / Medium / Hard) and platform tags (LeetCode, GFG, Codeforces).
  - [ ] Implement smooth reveal notes toggle button.
  - [ ] Style color-coded SuperMemo SM-2 rating buttons with interval prediction labels:
    - 🔴 **Again** (Reset interval / 1d)
    - 🟠 **Hard** (Slight increase)
    - 🔵 **Good / Medium** (Standard interval)
    - 🟢 **Easy** (Boosted interval)
  - [ ] Add keyboard hotkey listener:
    - `Spacebar`: Toggle reveal notes
    - `1`: Again | `2`: Hard | `3`: Medium | `4`: Easy
  - [ ] Polish `ReviewCompleted.tsx` with victory screen animations and session summary metrics.

---

### 4️⃣ Phase 4: Problem Repository & Glass Creation Modal
- [ ] **Task 4: Redesign Problem Management Page**
  - **Files:** `app/problems/page.tsx`, `components/problems/ProblemModal.tsx`
  - [ ] Add live search input bar (filtering by title, platform, tag).
  - [ ] Add filter chips for Platform (LeetCode, GFG, Codeforces) and Difficulty (Easy, Medium, Hard).
  - [ ] Create a backdrop-blur Modal dialog for adding/editing problems (replaces inline form).
  - [ ] Redesign problem cards with tags, platform logos, hover glow, and action buttons (Solve ↗, Edit, Delete, Detail).

---

### 5️⃣ Phase 5: Problem Detail & Note Editor
- [ ] **Task 5: Upgrade Problem Detail View**
  - **Files:** `app/problems/[id]/page.tsx`, `components/notes/Note.tsx`, `components/notes/NoteForm.tsx`
  - [ ] Replace inline raw container styles with structured dark glass cards.
  - [ ] Add **Memory Strength Meter** (Visual retention gauge based on Ease Factor & Revision logs).
  - [ ] Format Notes view into structured tabs/accordions:
    - Intuition
    - Brute Force Approach
    - Optimized Approach
    - Time & Space Complexity
    - Key Learnings & Mistakes
  - [ ] Add syntax-highlighted code block formatting.
  - [ ] Redesign `components/reviews/RevisionHistory.tsx` into a vertical timeline with badge ratings.

---

### 6️⃣ Phase 6: Production Build Verification
- [ ] **Task 6: Build Sanity Check**
  - [ ] Run `pnpm run build` to verify 0 TypeScript and Next.js compilation errors.
  - [ ] Perform full manual verification across login, dashboard, problem creation, review session, and profile navigation.
