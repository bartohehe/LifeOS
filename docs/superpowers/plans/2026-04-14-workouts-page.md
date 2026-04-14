# Workouts Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Sprint 3 — shared `useWorkout` hook, updated `WorkoutWidget`, and full `/dashboard/workouts` page (weight card + RPE chart + history list).

**Architecture:** New `useWorkout` hook owns all mock data (8 entries + current weight). `WorkoutWidget` on the home dashboard and the workouts page both call this hook. Recharts `BarChart` renders RPE over last 8 workouts. All mock, Supabase fetch commented out.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Recharts 2.x, Lucide React, existing `card-green`/`card-beige`/`Badge` design system.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `dashboard/hooks/useWorkout.ts` | Create | Mock data + type definitions + Supabase-ready block |
| `dashboard/components/widgets/WorkoutWidget.tsx` | Modify | Replace inline MOCK with `useWorkout()` hook |
| `dashboard/app/dashboard/workouts/page.tsx` | Modify | Full page: weight card + RPE chart + history list |

---

## Task 1: useWorkout hook

**Files:**
- Create: `dashboard/hooks/useWorkout.ts`

- [ ] **Step 1: Create the hook**

```typescript
// dashboard/hooks/useWorkout.ts
'use client'
import { useMemo } from 'react'

export interface WorkoutEntry {
  id: string
  date: string          // 'YYYY-MM-DD'
  duration_min: number
  rpe: number           // 1–10
  notes: string
  exercises: string[]
}

interface UseWorkoutResult {
  lastWorkout: WorkoutEntry | null
  history: WorkoutEntry[]      // newest first
  currentWeight: number | null
  loading: boolean
}

const MOCK_HISTORY: WorkoutEntry[] = [
  { id: '1', date: '2026-04-13', duration_min: 45, rpe: 7,  notes: '', exercises: ['Przysiad', 'Martwy ciąg', 'Wyciskanie'] },
  { id: '2', date: '2026-04-11', duration_min: 60, rpe: 8,  notes: '', exercises: ['Pull-up', 'Wioślarstwo', 'OHP'] },
  { id: '3', date: '2026-04-09', duration_min: 50, rpe: 6,  notes: '', exercises: ['Przysiad', 'Martwy ciąg'] },
  { id: '4', date: '2026-04-07', duration_min: 55, rpe: 8,  notes: '', exercises: ['Wyciskanie', 'Pull-up', 'Biceps curl'] },
  { id: '5', date: '2026-04-05', duration_min: 40, rpe: 7,  notes: '', exercises: ['Przysiad', 'OHP', 'Triceps'] },
  { id: '6', date: '2026-04-03', duration_min: 65, rpe: 9,  notes: '', exercises: ['Martwy ciąg', 'Wioślarstwo'] },
  { id: '7', date: '2026-04-01', duration_min: 45, rpe: 7,  notes: '', exercises: ['Przysiad', 'Wyciskanie', 'Pull-up'] },
  { id: '8', date: '2026-03-29', duration_min: 50, rpe: 8,  notes: '', exercises: ['Martwy ciąg', 'OHP', 'Biceps curl'] },
]

const MOCK_WEIGHT = 82.4

export default function useWorkout(): UseWorkoutResult {
  // MOCK MODE — remove useMemo and uncomment Supabase block below when ready
  return useMemo(() => ({
    lastWorkout: MOCK_HISTORY[0],
    history: MOCK_HISTORY,
    currentWeight: MOCK_WEIGHT,
    loading: false,
  }), [])

  // ── REAL SUPABASE ──────────────────────────────────────────────────────────
  // const [state, setState] = useState<UseWorkoutResult>({ lastWorkout: null, history: [], currentWeight: null, loading: true })
  //
  // useEffect(() => {
  //   const supabase = createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  //   )
  //   async function load() {
  //     const { data: workouts } = await supabase
  //       .from('workouts')
  //       .select('id, date, duration_min, rpe, notes, workout_sets(exercise)')
  //       .order('date', { ascending: false })
  //       .limit(10)
  //     const history: WorkoutEntry[] = (workouts ?? []).map(w => ({
  //       id: w.id, date: w.date, duration_min: w.duration_min, rpe: w.rpe, notes: w.notes ?? '',
  //       exercises: (w.workout_sets ?? []).map((s: { exercise: string }) => s.exercise),
  //     }))
  //     const { data: stats } = await supabase
  //       .from('daily_stats')
  //       .select('weight_kg')
  //       .order('date', { ascending: false })
  //       .limit(1)
  //       .single()
  //     setState({ lastWorkout: history[0] ?? null, history, currentWeight: stats?.weight_kg ?? null, loading: false })
  //   }
  //   load()
  // }, [])
  //
  // return state
  // ──────────────────────────────────────────────────────────────────────────
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd E:/Projekty/LifeOS/dashboard && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add dashboard/hooks/useWorkout.ts
git commit -m "feat: add useWorkout hook with mock data and Supabase-ready block"
```

---

## Task 2: WorkoutWidget — use hook

**Files:**
- Modify: `dashboard/components/widgets/WorkoutWidget.tsx`

Replace the inline `MOCK` constant with `useWorkout()`. Add a relative-date helper.

- [ ] **Step 1: Replace file contents**

```typescript
// dashboard/components/widgets/WorkoutWidget.tsx
'use client'
import useWorkout from '@/hooks/useWorkout'
import Badge from '@/components/ui/Badge'

function relativeDate(dateStr: string): string {
  const today = new Date()
  const d = new Date(dateStr + 'T00:00:00')
  const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'dziś'
  if (diffDays === 1) return 'wczoraj'
  return `${diffDays} dni temu`
}

export default function WorkoutWidget() {
  const { lastWorkout } = useWorkout()
  if (!lastWorkout) return null

  return (
    <div className="card-green px-5 py-4 flex flex-col gap-3 h-full">
      <span className="text-[#3D5C35] text-xs uppercase tracking-widest">
        Ostatni trening
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[#1E2D1A] text-sm font-medium">{relativeDate(lastWorkout.date)}</span>
        <span className="text-[#5C7A4E] text-sm">{lastWorkout.duration_min} min</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#5C7A4E] text-xs">RPE</span>
        <Badge>{lastWorkout.rpe}/10</Badge>
      </div>
      <div className="flex flex-col gap-1">
        {lastWorkout.exercises.map((ex) => (
          <span key={ex} className="text-[#3D5C35] text-sm">· {ex}</span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd E:/Projekty/LifeOS/dashboard && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add dashboard/components/widgets/WorkoutWidget.tsx
git commit -m "feat: WorkoutWidget uses useWorkout hook instead of inline mock"
```

---

## Task 3: Workouts page

**Files:**
- Modify: `dashboard/app/dashboard/workouts/page.tsx`

Full page: weight card + Recharts RPE bar chart + scrollable history list.

- [ ] **Step 1: Replace file contents**

```typescript
// dashboard/app/dashboard/workouts/page.tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import useWorkout from '@/hooks/useWorkout'
import Badge from '@/components/ui/Badge'

function formatPolishDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const days = ['nie', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob']
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${days[date.getDay()]} ${dd}.${mm}`
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function WorkoutsPage() {
  const { history, currentWeight } = useWorkout()

  const chartData = history.slice(0, 8).reverse().map(w => ({
    date: formatShortDate(w.date),
    rpe: w.rpe,
  }))

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        background: '#EFF5EC',
        padding: 24,
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gap: 16,
      }}
    >
      {/* Top row: weight + chart */}
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Weight card */}
        <div className="card-beige px-5 py-4 flex flex-col gap-2" style={{ minWidth: 180 }}>
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Aktualna waga</span>
          <div className="flex items-baseline gap-1">
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>
              {currentWeight ?? '—'}
            </span>
            <span className="text-[#5C7A4E] text-sm">kg</span>
          </div>
          <span className="text-[#5C7A4E] text-xs">↓ 1.2 kg od początku miesiąca</span>
        </div>

        {/* RPE chart */}
        <div className="card-green px-5 py-4 flex flex-col gap-3" style={{ flex: 1 }}>
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">RPE — ostatnie treningi</span>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DAE8D4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5C7A4E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fontSize: 10, fill: '#5C7A4E' }} axisLine={false} tickLine={false} />
              <Bar dataKey="rpe" fill="#5C7A4E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History list */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Historia treningów</span>
        {history.map((w) => (
          <div key={w.id} className="card-green px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#1E2D1A] text-sm font-medium">{formatPolishDate(w.date)}</span>
              <span className="text-[#5C7A4E] text-xs">{w.exercises.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#5C7A4E] text-sm">{w.duration_min} min</span>
              <Badge>RPE {w.rpe}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd E:/Projekty/LifeOS/dashboard && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add dashboard/app/dashboard/workouts/page.tsx
git commit -m "feat: implement workouts page with weight card, RPE chart, and history"
```

---

## Task 4: Visual verification

- [ ] **Step 1: Start dev server**

```bash
cd E:/Projekty/LifeOS/dashboard && npm run dev
```

Expected: `✓ Ready` on port 3000

- [ ] **Step 2: Verify home dashboard at `http://localhost:3000/dashboard`**

Check `WorkoutWidget` still shows last workout correctly (date now says "wczoraj" or "1 dzień temu" depending on today's date — the mock date is 2026-04-13 so if today is 2026-04-14 it should say "wczoraj").

- [ ] **Step 3: Verify workouts page at `http://localhost:3000/dashboard/workouts`**

Check:
- Light `#EFF5EC` background
- Weight card: "82.4 kg", "↓ 1.2 kg od początku miesiąca"
- RPE bar chart: 8 bars with dates on X axis, values 0–10
- History list: 8 rows each with Polish date, exercises, duration, RPE badge
- BottomNav "Treningi" tab is active

- [ ] **Step 4: Stop dev server after verification**
