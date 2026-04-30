# Correlations Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/dashboard/correlations` page with a `useCorrelations` hook (mock data, Supabase-ready) and a 2×2 grid of dual-line Recharts time-series charts covering sleep/mood/workout/spending/life-score relationships, with a 7/14/30-day range selector.

**Architecture:** A single `useCorrelations(days)` hook returns `CorrelationEntry[]` sliced to the requested window from 30 days of mock data. The page holds `days` in local state and passes it to the hook; four `ComposedChart` cards each render two `Line` components on independent left/right `YAxis` instances. The `overflow: hidden` wrapper pattern (learned in Sprint 4) prevents `ResponsiveContainer` from over-measuring its container inside a CSS grid.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Recharts (`ComposedChart`, `Line`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`), Tailwind CSS, `useMemo`.

---

## File Map

| File | Action |
|------|--------|
| `dashboard/hooks/useCorrelations.ts` | Create |
| `dashboard/app/dashboard/correlations/page.tsx` | Modify (replace stub) |

---

## Task 1: `useCorrelations` hook

**Files:**
- Create: `dashboard/hooks/useCorrelations.ts`

- [ ] **Step 1: Create the file with interfaces and mock data**

```typescript
// dashboard/hooks/useCorrelations.ts
'use client'
import { useMemo } from 'react'

export interface CorrelationEntry {
  date: string            // 'YYYY-MM-DD'
  sleep_hours: number | null
  mood: number | null     // 1–10
  life_score: number | null
  workout_rpe: number | null  // null = rest day
  daily_spend: number | null  // PLN, sum of that day's expenses
}

export interface UseCorrelationsResult {
  data: CorrelationEntry[]
  loading: boolean
}

// 30 days: 2026-04-01 → 2026-04-30
// workout_rpe present Mon/Tue/Thu/Fri/Sat (~5×/week), null on Wed/Sun
// daily_spend higher on weekends
const MOCK_DATA: CorrelationEntry[] = [
  { date: '2026-04-01', sleep_hours: 7.5, mood: 7, life_score: 72, workout_rpe: null,  daily_spend: 180 },
  { date: '2026-04-02', sleep_hours: 6.0, mood: 5, life_score: 61, workout_rpe: 7,     daily_spend: 45  },
  { date: '2026-04-03', sleep_hours: 7.0, mood: 6, life_score: 67, workout_rpe: 6,     daily_spend: 30  },
  { date: '2026-04-04', sleep_hours: 8.0, mood: 8, life_score: 78, workout_rpe: null,  daily_spend: 20  },
  { date: '2026-04-05', sleep_hours: 7.5, mood: 7, life_score: 74, workout_rpe: 8,     daily_spend: 55  },
  { date: '2026-04-06', sleep_hours: 6.5, mood: 6, life_score: 65, workout_rpe: 7,     daily_spend: 38  },
  { date: '2026-04-07', sleep_hours: 5.5, mood: 4, life_score: 55, workout_rpe: 5,     daily_spend: 250 },
  { date: '2026-04-08', sleep_hours: 8.5, mood: 9, life_score: 88, workout_rpe: null,  daily_spend: 200 },
  { date: '2026-04-09', sleep_hours: 7.0, mood: 7, life_score: 71, workout_rpe: 6,     daily_spend: 34  },
  { date: '2026-04-10', sleep_hours: 7.5, mood: 8, life_score: 76, workout_rpe: 7,     daily_spend: 90  },
  { date: '2026-04-11', sleep_hours: 8.0, mood: 8, life_score: 80, workout_rpe: null,  daily_spend: 45  },
  { date: '2026-04-12', sleep_hours: 6.0, mood: 5, life_score: 60, workout_rpe: 8,     daily_spend: 67  },
  { date: '2026-04-13', sleep_hours: 7.0, mood: 7, life_score: 70, workout_rpe: 6,     daily_spend: 34  },
  { date: '2026-04-14', sleep_hours: null, mood: 6, life_score: 64, workout_rpe: 5,    daily_spend: 220 },
  { date: '2026-04-15', sleep_hours: 8.0, mood: 8, life_score: 79, workout_rpe: null,  daily_spend: 180 },
  { date: '2026-04-16', sleep_hours: 7.5, mood: 7, life_score: 73, workout_rpe: 7,     daily_spend: 28  },
  { date: '2026-04-17', sleep_hours: 6.5, mood: 6, life_score: 63, workout_rpe: 8,     daily_spend: 42  },
  { date: '2026-04-18', sleep_hours: 7.0, mood: 7, life_score: 69, workout_rpe: null,  daily_spend: 15  },
  { date: '2026-04-19', sleep_hours: 8.5, mood: 9, life_score: 85, workout_rpe: 9,     daily_spend: 60  },
  { date: '2026-04-20', sleep_hours: 7.0, mood: 7, life_score: 72, workout_rpe: 7,     daily_spend: 55  },
  { date: '2026-04-21', sleep_hours: 5.5, mood: 4, life_score: 57, workout_rpe: 4,     daily_spend: 230 },
  { date: '2026-04-22', sleep_hours: 8.0, mood: 8, life_score: 80, workout_rpe: null,  daily_spend: 190 },
  { date: '2026-04-23', sleep_hours: 7.5, mood: 8, life_score: 77, workout_rpe: 6,     daily_spend: 30  },
  { date: '2026-04-24', sleep_hours: 7.0, mood: 7, life_score: 71, workout_rpe: 7,     daily_spend: 89  },
  { date: '2026-04-25', sleep_hours: 6.0, mood: 5, life_score: 62, workout_rpe: null,  daily_spend: 44  },
  { date: '2026-04-26', sleep_hours: 8.0, mood: 8, life_score: 78, workout_rpe: 8,     daily_spend: 120 },
  { date: '2026-04-27', sleep_hours: 7.5, mood: 7, life_score: 74, workout_rpe: 6,     daily_spend: 35  },
  { date: '2026-04-28', sleep_hours: null, mood: 5, life_score: 59, workout_rpe: 5,    daily_spend: 200 },
  { date: '2026-04-29', sleep_hours: 7.0, mood: 7, life_score: 70, workout_rpe: null,  daily_spend: 175 },
  { date: '2026-04-30', sleep_hours: 8.0, mood: 8, life_score: 79, workout_rpe: 7,     daily_spend: 120 },
]
```

- [ ] **Step 2: Add the hook function with Supabase block and export**

Append to the same file:

```typescript
// ── REAL SUPABASE ──────────────────────────────────────────────────────────────
// export default function useCorrelations(days: 7 | 14 | 30): UseCorrelationsResult {
//   const [state, setState] = useState<UseCorrelationsResult>({ data: [], loading: true })
//   useEffect(() => {
//     const supabase = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//     async function load() {
//       const since = new Date()
//       since.setDate(since.getDate() - days)
//       const sinceStr = since.toISOString().slice(0, 10)
//       const [{ data: stats }, { data: workouts }, { data: expenses }] = await Promise.all([
//         supabase.from('daily_stats').select('date,sleep_hours,mood,life_score')
//           .gte('date', sinceStr).order('date', { ascending: true }),
//         supabase.from('workouts').select('date,rpe')
//           .gte('date', sinceStr).order('date', { ascending: true }),
//         supabase.from('expenses').select('created_at,amount')
//           .gte('created_at', sinceStr).order('created_at', { ascending: true }),
//       ])
//       // Group workouts by date → avg RPE
//       const rpeByDate: Record<string, number[]> = {}
//       for (const w of workouts ?? []) {
//         if (!rpeByDate[w.date]) rpeByDate[w.date] = []
//         rpeByDate[w.date].push(w.rpe)
//       }
//       // Group expenses by date → sum
//       const spendByDate: Record<string, number> = {}
//       for (const e of expenses ?? []) {
//         const d = (e.created_at as string).slice(0, 10)
//         spendByDate[d] = (spendByDate[d] ?? 0) + Number(e.amount)
//       }
//       const entries: CorrelationEntry[] = (stats ?? []).map(s => ({
//         date: s.date,
//         sleep_hours: s.sleep_hours ?? null,
//         mood: s.mood ?? null,
//         life_score: s.life_score ?? null,
//         workout_rpe: rpeByDate[s.date]
//           ? Math.round(rpeByDate[s.date].reduce((a, b) => a + b, 0) / rpeByDate[s.date].length)
//           : null,
//         daily_spend: spendByDate[s.date] != null
//           ? Math.round(spendByDate[s.date] * 100) / 100
//           : null,
//       }))
//       setState({ data: entries, loading: false })
//     }
//     load()
//   }, [days])
//   return state
// }
// ──────────────────────────────────────────────────────────────────────────────

// MOCK MODE — replace with Supabase block above when ready
export default function useCorrelations(days: 7 | 14 | 30): UseCorrelationsResult {
  return useMemo(() => ({
    data: MOCK_DATA.slice(-days),
    loading: false,
  }), [days])
}
```

- [ ] **Step 3: TypeScript check**

Run from `dashboard/`:
```bash
npx tsc --noEmit
```
Expected: no output (zero errors).

- [ ] **Step 4: Commit**

```bash
git add dashboard/hooks/useCorrelations.ts
git commit -m "feat: add useCorrelations hook with mock data and Supabase-ready block"
```

---

## Task 2: Correlations page

**Files:**
- Modify: `dashboard/app/dashboard/correlations/page.tsx` (full replacement of stub)

- [ ] **Step 1: Write the full page**

Replace the entire contents of `dashboard/app/dashboard/correlations/page.tsx` with:

```tsx
'use client'
import { useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import useCorrelations from '@/hooks/useCorrelations'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}`
}

// ── Sub-component: one dual-line chart card ───────────────────────────────────

interface ChartCardProps {
  title: string
  data: Record<string, unknown>[]
  leftKey: string
  leftColor: string
  leftLabel: string
  leftDomain?: [number | string, number | string]
  rightKey: string
  rightColor: string
  rightLabel: string
  rightDomain?: [number | string, number | string]
  currencyKey?: string   // whichever dataKey should render as PLN in the tooltip
}

function ChartCard({
  title,
  data,
  leftKey,
  leftColor,
  leftLabel,
  leftDomain,
  rightKey,
  rightColor,
  rightLabel,
  rightDomain,
  currencyKey,
}: ChartCardProps) {
  return (
    <div className="card-green px-4 py-3 flex flex-col gap-2" style={{ minWidth: 0 }}>
      <span className="text-[#3D5C35] text-xs uppercase tracking-widest">{title}</span>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 36, left: -12, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: '#5C7A4E' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={leftDomain}
              tick={{ fontSize: 10, fill: leftColor }}
              axisLine={false}
              tickLine={false}
              width={32}
              label={{ value: leftLabel, angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 9, fill: leftColor } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={rightDomain}
              tick={{ fontSize: 10, fill: rightColor }}
              axisLine={false}
              tickLine={false}
              width={36}
              label={{ value: rightLabel, angle: 90, position: 'insideRight', offset: 12, style: { fontSize: 9, fill: rightColor } }}
            />
            <Tooltip
              contentStyle={{ background: '#EFF5EC', border: '1px solid #DAE8D4', borderRadius: 8, fontSize: 11 }}
              formatter={(value: string | number, name: string | number) => {
                if (currencyKey && name === currencyKey) {
                  return [`${Number(value).toLocaleString('pl-PL')} zł`, String(name)]
                }
                return [String(value), String(name)]
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={leftKey}
              stroke={leftColor}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={rightKey}
              stroke={rightColor}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const RANGE_OPTIONS: Array<7 | 14 | 30> = [7, 14, 30]

export default function CorrelationsPage() {
  const [days, setDays] = useState<7 | 14 | 30>(7)
  const { data } = useCorrelations(days)

  // Recharts requires plain objects — CorrelationEntry satisfies this
  const chartData = data as Record<string, unknown>[]

  return (
    <div
      className="w-full h-full flex flex-col gap-4"
      style={{ background: '#EFF5EC', padding: 24 }}
    >
      {/* Range selector */}
      <div className="flex gap-2">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setDays(opt)}
            className={opt === days ? 'card-green px-4 py-1.5 text-sm font-medium text-[#1E2D1A]' : 'card-beige px-4 py-1.5 text-sm text-[#5C7A4E]'}
            style={{ borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            {opt}d
          </button>
        ))}
      </div>

      {/* 2×2 chart grid */}
      <div className="grid grid-cols-2 gap-4 flex-1" style={{ minHeight: 0 }}>
        <ChartCard
          title="Sen → Nastrój"
          data={chartData}
          leftKey="sleep_hours"
          leftColor="#5C7A4E"
          leftLabel="godz."
          rightKey="mood"
          rightColor="#C8A87A"
          rightLabel="nastrój"
          rightDomain={[0, 10]}
        />
        <ChartCard
          title="Sen → Life Score"
          data={chartData}
          leftKey="sleep_hours"
          leftColor="#5C7A4E"
          leftLabel="godz."
          rightKey="life_score"
          rightColor="#3D5C35"
          rightLabel="score"
          rightDomain={[0, 100]}
        />
        <ChartCard
          title="Trening → Nastrój"
          data={chartData}
          leftKey="workout_rpe"
          leftColor="#8B3A3A"
          leftLabel="RPE"
          leftDomain={[0, 10]}
          rightKey="mood"
          rightColor="#C8A87A"
          rightLabel="nastrój"
          rightDomain={[0, 10]}
        />
        <ChartCard
          title="Wydatki → Life Score"
          data={chartData}
          leftKey="daily_spend"
          leftColor="#C8A87A"
          leftLabel="zł"
          rightKey="life_score"
          rightColor="#3D5C35"
          rightLabel="score"
          rightDomain={[0, 100]}
          currencyKey="daily_spend"
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript check**

Run from `dashboard/`:
```bash
npx tsc --noEmit
```
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add dashboard/app/dashboard/correlations/page.tsx
git commit -m "feat: correlations page — 2x2 dual-line charts with range selector"
```

---

## Task 3: Visual verification

**Files:** none (read-only browser check)

- [ ] **Step 1: Start dev server** (if not running)

```bash
cd dashboard && npm run dev
```

- [ ] **Step 2: Navigate to `/dashboard/correlations`**

Click the "Korelacje" tab in BottomNav. Verify:
- Range buttons visible: `7d` (active/green), `14d`, `30d`
- Four chart cards in 2×2 grid, each filling its cell
- Each chart has two coloured lines and correct axis labels
- Switching to `14d` / `30d` adds more data points
- Days with `workout_rpe: null` show a gap in the Trening line (not a zero)
- No TypeScript or runtime console errors

- [ ] **Step 3: Commit sprint marker**

```bash
git commit --allow-empty -m "fifth sprint: DONE"
```
