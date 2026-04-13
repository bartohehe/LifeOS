# Active Mode Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the active mode dashboard home at `/dashboard` — a widget grid (avatar, weather, clock, life score, workout, finance, calendar) with a 3-minute auto-return to passive mode.

**Architecture:** `DashboardLayout` becomes a client component owning the 3-min inactivity timer (same `useCallback`/`useRef`/`useEffect` pattern as passive mode). The home page renders a CSS grid with 6 widget slots and Framer Motion stagger animations. All new widgets use mock data.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Framer Motion, Lucide React, existing `card-green`/`card-beige` CSS classes, `Badge` and `ProgressBar` UI primitives.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/widgets/LifeScoreWidget.tsx` | Modify | Add `size` prop — `"small"` hides progress bars |
| `components/widgets/WorkoutWidget.tsx` | Modify | Last workout: date, duration, RPE, exercises |
| `components/widgets/FinanceWidget.tsx` | Modify | Budget bar + net worth + last expense |
| `components/widgets/CalendarWidget.tsx` | Modify | Next event + countdown |
| `app/dashboard/layout.tsx` | Modify | `'use client'`, 3-min auto-return timer, wraps `ActiveLayout` |
| `app/dashboard/page.tsx` | Modify | CSS grid + Framer Motion stagger + all 6 widget slots |

---

## Task 1: LifeScoreWidget — add `size` prop

**Files:**
- Modify: `dashboard/components/widgets/LifeScoreWidget.tsx`

Add optional `size?: 'full' | 'small'` prop (default `'full'`). `size="small"` renders only the score number + label, no progress bars.

**Step 1: Replace file contents**

```typescript
// components/widgets/LifeScoreWidget.tsx
'use client'
import useLifeScore from '@/hooks/useLifeScore'
import ProgressBar from '@/components/ui/ProgressBar'
import { scoreColor } from '@/lib/lifeScore'
import type { LifeScoreData } from '@/lib/types'

const BARS: { key: keyof Omit<LifeScoreData, 'score'>; label: string }[] = [
  { key: 'sleepScore', label: 'Sen' },
  { key: 'workoutScore', label: 'Trening' },
  { key: 'budgetScore', label: 'Budżet' },
  { key: 'habitScore', label: 'Nawyki' },
]

interface LifeScoreWidgetProps {
  size?: 'full' | 'small'
}

export default function LifeScoreWidget({ size = 'full' }: LifeScoreWidgetProps) {
  const { data } = useLifeScore()
  if (!data) return null

  const color = scoreColor(data.score)

  return (
    <div className="card-beige px-5 py-4 flex flex-col gap-3 min-w-[140px]">
      <div>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: size === 'small' ? 48 : 56, fontWeight: 700, color, lineHeight: 1 }}>
          {data.score}
        </span>
        <span className="block text-[#3D5C35] text-xs uppercase tracking-widest mt-1">
          Life Score
        </span>
      </div>
      {size === 'full' && (
        <div className="flex flex-col gap-2">
          {BARS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-[#5C7A4E] text-xs">{label}</span>
                <span className="text-[#5C7A4E] text-xs">{Math.round(data[key])}</span>
              </div>
              <ProgressBar value={data[key]} color={scoreColor(data[key])} height={6} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/LifeScoreWidget.tsx
git commit -m "feat: add size prop to LifeScoreWidget (small hides progress bars)"
```

---

## Task 2: WorkoutWidget

**Files:**
- Modify: `dashboard/components/widgets/WorkoutWidget.tsx`

Displays last workout summary with mock data. Uses `Badge` for RPE.

**Step 1: Replace file contents**

```typescript
// components/widgets/WorkoutWidget.tsx
import Badge from '@/components/ui/Badge'

const MOCK = {
  date: 'wczoraj',
  duration: 45,
  rpe: 7,
  exercises: ['Przysiad', 'Martwy ciąg', 'Wyciskanie'],
}

export default function WorkoutWidget() {
  return (
    <div className="card-green px-5 py-4 flex flex-col gap-3 h-full">
      <span className="text-[#3D5C35] text-xs uppercase tracking-widest">
        Ostatni trening
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[#1E2D1A] text-sm font-medium">{MOCK.date}</span>
        <span className="text-[#5C7A4E] text-sm">{MOCK.duration} min</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#5C7A4E] text-xs">RPE</span>
        <Badge>{MOCK.rpe}/10</Badge>
      </div>
      <div className="flex flex-col gap-1">
        {MOCK.exercises.map((ex) => (
          <span key={ex} className="text-[#3D5C35] text-sm">· {ex}</span>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/WorkoutWidget.tsx
git commit -m "feat: implement WorkoutWidget with mock data"
```

---

## Task 3: FinanceWidget

**Files:**
- Modify: `dashboard/components/widgets/FinanceWidget.tsx`

Displays budget progress bar, net worth, and last expense. Uses `ProgressBar` and `Badge`.

**Step 1: Replace file contents**

```typescript
// components/widgets/FinanceWidget.tsx
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'

const MOCK = {
  monthlyBudget: 3000,
  spent: 2190,
  netWorth: 45200,
  lastExpense: { amount: 34.50, category: 'food', note: 'Biedronka' },
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'jedzenie',
  transport: 'transport',
  entertainment: 'rozrywka',
  health: 'zdrowie',
  housing: 'mieszkanie',
  other: 'inne',
}

export default function FinanceWidget() {
  const pct = Math.round((MOCK.spent / MOCK.monthlyBudget) * 100)

  return (
    <div className="card-beige px-5 py-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Budżet miesiąca</span>
          <span className="text-[#1E2D1A] text-sm font-medium">{pct}%</span>
        </div>
        <ProgressBar value={pct} color={pct > 90 ? '#8B3A3A' : pct > 70 ? '#C8A87A' : '#5C7A4E'} height={10} />
        <span className="text-[#5C7A4E] text-xs">{MOCK.spent.toLocaleString('pl-PL')} / {MOCK.monthlyBudget.toLocaleString('pl-PL')} zł</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Majątek netto</span>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>
          {MOCK.netWorth.toLocaleString('pl-PL')} zł
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Ostatni wydatek</span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#1E2D1A] text-sm font-medium">{MOCK.lastExpense.amount.toFixed(2)} zł</span>
          <Badge>{CATEGORY_LABELS[MOCK.lastExpense.category] ?? MOCK.lastExpense.category}</Badge>
          <span className="text-[#5C7A4E] text-sm">{MOCK.lastExpense.note}</span>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/FinanceWidget.tsx
git commit -m "feat: implement FinanceWidget with mock data"
```

---

## Task 4: CalendarWidget

**Files:**
- Modify: `dashboard/components/widgets/CalendarWidget.tsx`

Displays next calendar event with countdown. Uses Lucide `Calendar` icon.

**Step 1: Replace file contents**

```typescript
// components/widgets/CalendarWidget.tsx
import { Calendar } from 'lucide-react'

const MOCK = {
  title: 'Spotkanie z Marcinem',
  startTime: '15:00',
  hoursUntil: 3,
}

export default function CalendarWidget() {
  return (
    <div className="card-green px-5 py-4 flex items-center gap-4">
      <Calendar size={32} color="#3D5C35" />
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Następne wydarzenie</span>
        <span className="text-[#1E2D1A] text-base font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          {MOCK.title}
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[#1E2D1A] text-sm font-medium">{MOCK.startTime}</span>
        <span className="text-[#5C7A4E] text-xs">za {MOCK.hoursUntil} godz.</span>
      </div>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/CalendarWidget.tsx
git commit -m "feat: implement CalendarWidget with mock data"
```

---

## Task 5: DashboardLayout — auto-return timer

**Files:**
- Modify: `dashboard/app/dashboard/layout.tsx`

Becomes a client component. Owns the 3-minute inactivity timer. Wraps children in `ActiveLayout` (which adds BottomNav).

**Step 1: Replace file contents**

```typescript
// app/dashboard/layout.tsx
'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ActiveLayout from '@/components/layout/ActiveLayout'

const RETURN_DELAY_MS = 3 * 60 * 1000 // 3 minutes

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => router.push('/'), RETURN_DELAY_MS)
  }, [router])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [startTimer])

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      onMouseMove={startTimer}
      onTouchStart={startTimer}
    >
      <ActiveLayout>{children}</ActiveLayout>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/app/dashboard/layout.tsx
git commit -m "feat: add 3-min auto-return timer to DashboardLayout"
```

---

## Task 6: Dashboard home page — widget grid

**Files:**
- Modify: `dashboard/app/dashboard/page.tsx`

Full widget grid with Framer Motion stagger animations. Avatar is an inline SVG placeholder (same as `PassiveLayout`).

**Step 1: Replace file contents**

```typescript
// app/dashboard/page.tsx
'use client'
import { motion } from 'framer-motion'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import ClockWidget from '@/components/widgets/ClockWidget'
import LifeScoreWidget from '@/components/widgets/LifeScoreWidget'
import WorkoutWidget from '@/components/widgets/WorkoutWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'
import CalendarWidget from '@/components/widgets/CalendarWidget'

function AvatarCard() {
  return (
    <div className="card-green flex items-center justify-center h-full" style={{ minHeight: 200 }}>
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar placeholder">
        <circle cx="60" cy="28" r="22" fill="#3D5C35" />
        <rect x="38" y="54" width="44" height="50" rx="10" fill="#3D5C35" />
        <rect x="18" y="56" width="18" height="36" rx="8" fill="#3D5C35" />
        <rect x="84" y="56" width="18" height="36" rx="8" fill="#3D5C35" />
        <rect x="40" y="100" width="16" height="40" rx="8" fill="#3D5C35" />
        <rect x="64" y="100" width="16" height="40" rx="8" fill="#3D5C35" />
      </svg>
    </div>
  )
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function DashboardHome() {
  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        background: '#EFF5EC',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gridTemplateRows: 'auto 1fr auto',
        gap: 16,
      }}
    >
      {/* Row 1, Col 1: Avatar */}
      <motion.div {...fadeUp(0)}>
        <AvatarCard />
      </motion.div>

      {/* Row 1, Col 2: Weather + Clock + LifeScore */}
      <motion.div className="flex gap-4" {...fadeUp(0.05)}>
        <WeatherWidget />
        <ClockWidget color="#1E2D1A" />
        <LifeScoreWidget size="small" />
      </motion.div>

      {/* Row 2, Col 1: Workout */}
      <motion.div {...fadeUp(0.10)}>
        <WorkoutWidget />
      </motion.div>

      {/* Row 2, Col 2: Finance */}
      <motion.div {...fadeUp(0.15)}>
        <FinanceWidget />
      </motion.div>

      {/* Row 3: Calendar — full width */}
      <motion.div className="col-span-2" {...fadeUp(0.20)}>
        <CalendarWidget />
      </motion.div>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/app/dashboard/page.tsx
git commit -m "feat: implement active mode home widget grid with Framer Motion"
```

---

## Task 7: Visual verification

**Step 1: Start dev server**

```bash
cd dashboard && npm run dev
```

Expected: `✓ Ready` on port 3000

**Step 2: Open `http://localhost:3000`**

Verify passive mode loads. Click → should navigate to `/dashboard`.

**Step 3: Verify active home at `http://localhost:3000/dashboard`**

Check:
- Light `#EFF5EC` background
- Row 1: green avatar card (left) + weather/clock/life score in a row (right)
- Row 2: workout card (left) + finance card (right)
- Row 3: calendar card full width
- BottomNav at bottom with 5 tabs, Home tab active
- Framer Motion stagger animations on load

**Step 4: Test auto-return**

Temporarily change `RETURN_DELAY_MS = 5000` in `app/dashboard/layout.tsx`. Stay idle 5 seconds. Should navigate back to `/`.

**Step 5: Restore delay and commit if fixes needed**

```typescript
const RETURN_DELAY_MS = 3 * 60 * 1000 // restore
```

```bash
git add -u
git commit -m "fix: active home visual adjustments after review"
```
