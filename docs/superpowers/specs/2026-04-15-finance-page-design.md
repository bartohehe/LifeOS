# Finance Page — Sprint 4 Design Spec

**Goal:** Implement Sprint 4 — shared `useFinance` hook, updated `FinanceWidget`, and full `/dashboard/finanse` page (budget bar + net worth chart + expense history).

**Approach:** Mock-first, Supabase-ready. All data served from hook mock; real fetch block commented out.

---

## Data Layer

### `dashboard/hooks/useFinance.ts` (new)

```typescript
interface FinanceSnapshot {
  date: string        // 'YYYY-MM'
  cash_pln: number
  investments: number
  crypto_pln: number
  liabilities: number
  total: number       // cash + investments + crypto - liabilities
}

interface UseFinanceResult {
  monthlyBudget: number
  spent: number
  expenses: Expense[]             // last 10, newest first (Expense from lib/types.ts)
  netWorthHistory: FinanceSnapshot[]  // 6 monthly snapshots, oldest first
  currentNetWorth: number         // netWorthHistory[last].total
  loading: boolean
}
```

**Mock data:**
- `monthlyBudget: 3000`, `spent: 2190`
- 6 monthly `netWorthHistory` snapshots from 2025-11 to 2026-04, showing gradual growth
- 10 `expenses` with varied categories (food, transport, entertainment, health, housing, other), amounts 15–450 zł, realistic notes in Polish

**Supabase block (commented out):** Queries `expenses ORDER BY created_at DESC LIMIT 10` and `net_worth_snapshots ORDER BY created_at ASC LIMIT 6`. Uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## FinanceWidget (update)

**File:** `dashboard/components/widgets/FinanceWidget.tsx`

Replace inline `MOCK` constant with `useFinance()` hook. Layout unchanged:
- Budget progress bar + percentage
- Net worth value in PLN (Georgia serif)
- Last expense: amount + category badge + note

Guard: `if (loading) return null` — no, keep rendering with fallback values to avoid layout shift. Use `currentNetWorth` and `expenses[0]` for last expense.

---

## Finance Page

**File:** `dashboard/app/dashboard/finanse/page.tsx`

`'use client'` component. Uses `useFinance()`.

### Layout

```
background: #EFF5EC, padding: 24
gridTemplateRows: 'auto 1fr'
gap: 16
```

**Row 1 — Budget bar (full width, `card-beige`):**
- Label "Budżet miesiąca" + percentage right-aligned
- `ProgressBar` component (color: red if >90%, amber if >70%, green otherwise)
- `spent / monthlyBudget` values in PLN below bar

**Row 2 — Two columns (`gridTemplateColumns: '1fr 1fr'`, `gap: 16`):**

Left: **Net worth chart (`card-green`, `h-full`):**
- Label "Majątek netto"
- Recharts `ResponsiveContainer` + `AreaChart`
- Data: `netWorthHistory` (6 points)
- 3 stacked `Area` (`stackId="nw"`):
  - `cash_pln` — fill `#B8CDB2` (light green)
  - `investments` — fill `#5C7A4E` (mid green)
  - `crypto_pln` — fill `#3D5C35` (dark green)
- `Line` for `liabilities` — stroke `#8B3A3A`, dashed
- X axis: short month label (e.g. "lis", "gru", "sty"...)
- Y axis: abbreviated PLN values (e.g. "45k")
- No legend; tooltip on hover

Right: **Expense history (`flex flex-col gap-2 overflow-y-auto`):**
- Label "Historia wydatków"
- Each row: `card-beige px-4 py-3 flex justify-between`
  - Left: Polish date ("pon 13.04") + note (muted)
  - Right: amount in PLN + `Badge` for category

---

## File Map

| File | Action |
|------|--------|
| `dashboard/hooks/useFinance.ts` | Create |
| `dashboard/components/widgets/FinanceWidget.tsx` | Modify (use hook) |
| `dashboard/app/dashboard/finance/page.tsx` | Modify (replace stub) |

**Note:** The stub is at `dashboard/app/dashboard/finance/page.tsx` (English) but BottomNav links to `/dashboard/finance`. The page file stays at `finance/page.tsx` — the Polish "Finanse" label is only visual in the nav. Do NOT create a `finanse/` directory.

---

## Category label map

```typescript
const CATEGORY_LABELS: Record<string, string> = {
  food: 'jedzenie',
  transport: 'transport',
  entertainment: 'rozrywka',
  health: 'zdrowie',
  housing: 'mieszkanie',
  other: 'inne',
}
```

---

## Out of Scope

- Adding/editing expenses (no form)
- Real Supabase connection (commented out)
- Net worth breakdown tooltip (nice-to-have, skip for now)
- Legend for the chart (labels on areas are sufficient)
