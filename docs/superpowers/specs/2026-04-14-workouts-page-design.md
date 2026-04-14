# Workouts Page — Sprint 3 Design Spec

**Goal:** Implement the workouts section — a shared `useWorkout` hook, updated `WorkoutWidget`, and full `/dashboard/workouts` page with weight, RPE chart, and workout history.

**Approach:** Mock-first, Supabase-ready. All data served from hook mock; real fetch block commented out.

---

## Data Layer

### `dashboard/hooks/useWorkout.ts` (new)

```typescript
interface WorkoutEntry {
  id: string
  date: string          // 'YYYY-MM-DD'
  duration_min: number
  rpe: number           // 1–10
  notes: string
  exercises: string[]   // derived from workout_sets
}

interface UseWorkoutResult {
  lastWorkout: WorkoutEntry | null
  history: WorkoutEntry[]     // last 10 entries, newest first
  currentWeight: number | null
  loading: boolean
}
```

**Mock data:** 8 hardcoded `WorkoutEntry` objects + `currentWeight: 82.4`. Each entry has realistic Polish exercise names drawn from `['Przysiad', 'Martwy ciąg', 'Wyciskanie', 'Pull-up', 'Wioślarstwo', 'OHP', 'Biceps curl', 'Triceps']`.

**Supabase block (commented out):** Would query `workouts` LEFT JOIN `workout_sets` for exercise names, ordered by `date DESC LIMIT 10`. Weight comes from `daily_stats.weight_kg` (most recent row). Uses `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars.

**Existing `Workout` type in `lib/types.ts` is preserved.** `WorkoutEntry` extends it with `exercises: string[]`.

---

## WorkoutWidget (update)

**File:** `dashboard/components/widgets/WorkoutWidget.tsx`

Replace inline `MOCK` constant with `useWorkout()` hook call. Render `lastWorkout`. Layout unchanged:
- Label "Ostatni trening"
- Date + duration
- RPE `Badge`
- Exercise list (dots)

Guard: if `loading || !lastWorkout` → return `null`.

---

## Workouts Page

**File:** `dashboard/app/dashboard/workouts/page.tsx`

`'use client'` component. Uses `useWorkout()`.

### Layout

```
padding: 24px, display: grid, gridTemplateRows: 'auto 1fr', gap: 16
```

**Top row** — `display: flex, gap: 16`:

1. **WeightCard** (`card-beige`, `minWidth: 180px`):
   - Label "Aktualna waga" (uppercase tracking-widest)
   - Weight number in Georgia serif, 40px, bold
   - "kg" unit
   - Trend line: "↓ 1.2 kg od początku miesiąca" (mock, static text)

2. **RPE Chart** (`card-green`, `flex: 1`):
   - Label "RPE — ostatnie treningi"
   - Recharts `ResponsiveContainer` + `BarChart`
   - Data: `history.slice(0, 8).reverse()` → `[{ date: 'dd.MM', rpe }]`
   - X axis: formatted date (dd.MM), Y axis: domain [0, 10], ticks [0, 5, 10]
   - Bar fill: `#5C7A4E`, active fill: `#3D5C35`
   - No legend, minimal grid lines (`stroke: '#DAE8D4'`)

**History list** — `overflow-y: auto`:
- Label "Historia treningów"
- Each row: `card-green px-4 py-3 flex items-center justify-between`
  - Left: bold date (formatted Polish: "pon 13.04") + exercises (dot-separated, muted color)
  - Right: duration "45 min" + `Badge` for RPE

---

## File Map

| File | Action |
|------|--------|
| `dashboard/hooks/useWorkout.ts` | Create |
| `dashboard/components/widgets/WorkoutWidget.tsx` | Modify (use hook) |
| `dashboard/app/dashboard/workouts/page.tsx` | Modify (replace stub) |

---

## Out of Scope

- Adding/editing/deleting workouts (no form)
- Real Supabase connection (commented out, not wired)
- `bodyweight` table — `weight_kg` will be added to `daily_stats` at real integration time
- Recharts installation (already at `^2.13.0`)
