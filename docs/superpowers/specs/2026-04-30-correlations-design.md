# Correlations Page — Sprint 5 Design Spec

**Goal:** Implement the `/dashboard/correlations` page — a 2×2 grid of dual-line time-series charts showing relationships between sleep, mood, workouts, spending, and life score. Time range switchable between 7, 14, and 30 days.

---

## Data Layer

### `dashboard/hooks/useCorrelations.ts` (new)

```typescript
interface CorrelationEntry {
  date: string           // 'YYYY-MM-DD'
  sleep_hours: number | null
  mood: number | null    // 1–10
  life_score: number | null
  workout_rpe: number | null   // null = no workout that day
  daily_spend: number | null   // sum of expenses for that day
}

interface UseCorrelationsResult {
  data: CorrelationEntry[]
  loading: boolean
}
```

**Mock data:** 30 daily entries (2026-04-01 → 2026-04-30). Realistic variation:
- `sleep_hours`: 5.5–8.5, occasional null (missed log)
- `mood`: 4–9
- `life_score`: 55–88
- `workout_rpe`: present ~5 days/week, null on rest days
- `daily_spend`: 0–250 PLN, higher on weekends

Hook accepts `days: 7 | 14 | 30` and returns the last `days` entries from the mock array, oldest first.

**Supabase block (commented out):** Joins `daily_stats`, `workouts` (grouped by date, avg RPE), and `expenses` (grouped by date, sum amount) for the last N days ordered by date ASC.

---

## Correlations Page

**File:** `dashboard/app/dashboard/correlations/page.tsx`

`'use client'` component. Local state: `days: 7 | 14 | 30`, default `7`.

### Layout

```
background: #EFF5EC, padding: 24
display: flex flex-col gap-4
height: 100%
```

**Row 1 — Range selector:**
Three buttons: `7d`, `14d`, `30d`. Active button: `card-green` style, `font-medium`. Inactive: muted, `card-beige`. Wrap in `flex gap-2`.

**Row 2 — 2×2 chart grid:**
`grid grid-cols-2 gap-4 flex-1`

Each grid cell: `card-green px-4 py-3 flex flex-col gap-2`

---

## The Four Charts

Each chart uses Recharts `ComposedChart` with:
- `ResponsiveContainer width="100%" height="100%"`
- Outer div: `flex-1 min-h-0 overflow-hidden`
- `margin={{ top: 4, right: 36, left: -12, bottom: 0 }}`
- `XAxis` dataKey `"date"` — tickFormatter strips to `"DD.MM"` (e.g. `"13.04"`)
- Two `YAxis`: `yAxisId="left"` (orientation left) and `yAxisId="right"` (orientation right)
- Two `Line` components: `type="monotone"`, `dot={false}`, `connectNulls={false}`
- `Tooltip` with shared content
- No legend — colors and axis labels identify series

### Chart 1 — Sen → Nastrój

- Title: "Sen → Nastrój"
- Left Y: `sleep_hours`, color `#5C7A4E`, label "godz."
- Right Y: `mood`, domain `[0, 10]`, color `#C8A87A`, label "nastrój"

### Chart 2 — Sen → Life Score

- Title: "Sen → Life Score"
- Left Y: `sleep_hours`, color `#5C7A4E`, label "godz."
- Right Y: `life_score`, domain `[0, 100]`, color `#3D5C35`, label "score"

### Chart 3 — Trening → Nastrój

- Title: "Trening → Nastrój"
- Left Y: `workout_rpe`, domain `[0, 10]`, color `#8B3A3A`, label "RPE"
- Right Y: `mood`, domain `[0, 10]`, color `#C8A87A`, label "nastrój"

### Chart 4 — Wydatki → Life Score

- Title: "Wydatki → Life Score"
- Left Y: `daily_spend`, color `#C8A87A`, label "zł"
- Right Y: `life_score`, domain `[0, 100]`, color `#3D5C35`, label "score"
- Tooltip for `daily_spend` uses `toLocaleString('pl-PL')` + " zł"

---

## X-Axis Date Formatter

```typescript
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}`
}
```

---

## File Map

| File | Action |
|------|--------|
| `dashboard/hooks/useCorrelations.ts` | Create |
| `dashboard/app/dashboard/correlations/page.tsx` | Modify (replace stub) |

---

## Category Label / Color Summary

| Series | Color | Axis side |
|--------|-------|-----------|
| sleep_hours | `#5C7A4E` mid-green | left |
| mood | `#C8A87A` amber | right |
| life_score | `#3D5C35` dark-green | right |
| workout_rpe | `#8B3A3A` red | left |
| daily_spend | `#C8A87A` amber | left |

---

## Out of Scope

- Pearson correlation coefficient display
- Filtering by category of expense
- Annotations on chart (e.g. "best sleep week")
- Real Supabase connection (commented out)
