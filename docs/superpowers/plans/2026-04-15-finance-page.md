# Finance Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Sprint 4 — shared `useFinance` hook, updated `FinanceWidget`, and full `/dashboard/finance` page (budget bar + net worth stacked chart + expense history).

**Architecture:** New `useFinance` hook owns all mock data (monthly budget, 6 net worth snapshots, 10 expenses). `FinanceWidget` on the home dashboard and the finance page both call this hook. Recharts `ComposedChart` renders stacked net worth areas + liabilities line. All mock, Supabase fetch commented out.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Recharts 2.x (`ComposedChart`, `Area`, `Line`), existing `card-green`/`card-beige`/`Badge`/`ProgressBar` design system.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `dashboard/hooks/useFinance.ts` | Create | Mock data + type definitions + Supabase-ready block |
| `dashboard/components/widgets/FinanceWidget.tsx` | Modify | Replace inline MOCK with `useFinance()` hook |
| `dashboard/app/dashboard/finance/page.tsx` | Modify | Full page: budget bar + net worth chart + history list |

---

## Task 1: useFinance hook

**Files:**
- Create: `dashboard/hooks/useFinance.ts`

- [ ] **Step 1: Create the hook**

```typescript
// dashboard/hooks/useFinance.ts
'use client'
import { useMemo } from 'react'
import type { Expense } from '@/lib/types'

export interface FinanceSnapshot {
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
  expenses: Expense[]
  netWorthHistory: FinanceSnapshot[]
  currentNetWorth: number   // netWorthHistory[last].total
  loading: boolean
}

const MOCK_NET_WORTH_HISTORY: FinanceSnapshot[] = [
  { date: '2025-11', cash_pln: 8000,  investments: 28000, crypto_pln: 4000, liabilities: 2000, total: 38000 },
  { date: '2025-12', cash_pln: 9000,  investments: 29500, crypto_pln: 4200, liabilities: 1800, total: 40900 },
  { date: '2026-01', cash_pln: 7500,  investments: 31000, crypto_pln: 5000, liabilities: 1800, total: 41700 },
  { date: '2026-02', cash_pln: 8500,  investments: 32000, crypto_pln: 4800, liabilities: 1600, total: 43700 },
  { date: '2026-03', cash_pln: 9200,  investments: 33000, crypto_pln: 4500, liabilities: 1500, total: 45200 },
  { date: '2026-04', cash_pln: 9800,  investments: 33500, crypto_pln: 4200, liabilities: 1500, total: 46000 },
]

const MOCK_EXPENSES: Expense[] = [
  { id: '1',  created_at: '2026-04-13T18:30:00Z', amount: 34.50,   category: 'food',          note: 'Biedronka',              is_fixed: false },
  { id: '2',  created_at: '2026-04-12T09:15:00Z', amount: 120.00,  category: 'transport',     note: 'Paliwo',                 is_fixed: false },
  { id: '3',  created_at: '2026-04-11T20:00:00Z', amount: 45.00,   category: 'entertainment', note: 'Netflix + Spotify',      is_fixed: true  },
  { id: '4',  created_at: '2026-04-10T13:45:00Z', amount: 89.90,   category: 'food',          note: 'Lidl + Kaufland',        is_fixed: false },
  { id: '5',  created_at: '2026-04-09T16:20:00Z', amount: 250.00,  category: 'health',        note: 'Siłownia (kwartał)',     is_fixed: true  },
  { id: '6',  created_at: '2026-04-08T11:00:00Z', amount: 1800.00, category: 'housing',       note: 'Czynsz kwiecień',        is_fixed: true  },
  { id: '7',  created_at: '2026-04-07T19:30:00Z', amount: 67.40,   category: 'food',          note: 'Żabka + piekarnia',      is_fixed: false },
  { id: '8',  created_at: '2026-04-06T14:00:00Z', amount: 38.00,   category: 'transport',     note: 'Parking + autobus',      is_fixed: false },
  { id: '9',  created_at: '2026-04-05T12:30:00Z', amount: 199.00,  category: 'entertainment', note: 'Książki + gra Steam',    is_fixed: false },
  { id: '10', created_at: '2026-04-04T17:45:00Z', amount: 55.20,   category: 'food',          note: 'Carrefour',              is_fixed: false },
]

export default function useFinance(): UseFinanceResult {
  // MOCK MODE — remove useMemo and uncomment Supabase block below when ready
  return useMemo(() => ({
    monthlyBudget: 3000,
    spent: 2190,
    expenses: MOCK_EXPENSES,
    netWorthHistory: MOCK_NET_WORTH_HISTORY,
    currentNetWorth: MOCK_NET_WORTH_HISTORY[MOCK_NET_WORTH_HISTORY.length - 1].total,
    loading: false,
  }), [])

  // ── REAL SUPABASE ──────────────────────────────────────────────────────────
  // const [state, setState] = useState<UseFinanceResult>({
  //   monthlyBudget: 3000, spent: 0, expenses: [], netWorthHistory: [], currentNetWorth: 0, loading: true,
  // })
  //
  // useEffect(() => {
  //   const supabase = createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  //   )
  //   async function load() {
  //     const [{ data: expenses }, { data: snapshots }] = await Promise.all([
  //       supabase.from('expenses').select('*').order('created_at', { ascending: false }).limit(10),
  //       supabase.from('net_worth_snapshots').select('*').order('created_at', { ascending: true }).limit(6),
  //     ])
  //     const history: FinanceSnapshot[] = (snapshots ?? []).map(s => ({
  //       date: s.created_at.slice(0, 7),
  //       cash_pln: s.cash_pln, investments: s.investments,
  //       crypto_pln: s.crypto_pln, liabilities: s.liabilities, total: s.total,
  //     }))
  //     const currentMonth = new Date().toISOString().slice(0, 7)
  //     const spent = (expenses ?? [])
  //       .filter(e => e.created_at.startsWith(currentMonth))
  //       .reduce((acc, e) => acc + Number(e.amount), 0)
  //     setState({
  //       monthlyBudget: 3000,
  //       spent: Math.round(spent * 100) / 100,
  //       expenses: expenses ?? [],
  //       netWorthHistory: history,
  //       currentNetWorth: history[history.length - 1]?.total ?? 0,
  //       loading: false,
  //     })
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
git add dashboard/hooks/useFinance.ts
git commit -m "feat: add useFinance hook with mock data and Supabase-ready block"
```

---

## Task 2: FinanceWidget — use hook

**Files:**
- Modify: `dashboard/components/widgets/FinanceWidget.tsx`

Replace inline `MOCK` with `useFinance()`. Layout unchanged.

- [ ] **Step 1: Replace file contents**

```typescript
// dashboard/components/widgets/FinanceWidget.tsx
'use client'
import useFinance from '@/hooks/useFinance'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'

const CATEGORY_LABELS: Record<string, string> = {
  food: 'jedzenie',
  transport: 'transport',
  entertainment: 'rozrywka',
  health: 'zdrowie',
  housing: 'mieszkanie',
  other: 'inne',
}

export default function FinanceWidget() {
  const { monthlyBudget, spent, currentNetWorth, expenses } = useFinance()
  const pct = Math.round((spent / monthlyBudget) * 100)
  const lastExpense = expenses[0] ?? null

  return (
    <div className="card-beige px-5 py-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Budżet miesiąca</span>
          <span className="text-[#1E2D1A] text-sm font-medium">{pct}%</span>
        </div>
        <ProgressBar value={pct} color={pct > 90 ? '#8B3A3A' : pct > 70 ? '#C8A87A' : '#5C7A4E'} height={10} />
        <span className="text-[#5C7A4E] text-xs">{spent.toLocaleString('pl-PL')} / {monthlyBudget.toLocaleString('pl-PL')} zł</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Majątek netto</span>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>
          {currentNetWorth.toLocaleString('pl-PL')} zł
        </span>
      </div>

      {lastExpense && (
        <div className="flex flex-col gap-1">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Ostatni wydatek</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#1E2D1A] text-sm font-medium">{lastExpense.amount.toFixed(2)} zł</span>
            <Badge>{CATEGORY_LABELS[lastExpense.category] ?? lastExpense.category}</Badge>
            <span className="text-[#5C7A4E] text-sm">{lastExpense.note}</span>
          </div>
        </div>
      )}
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
git add dashboard/components/widgets/FinanceWidget.tsx
git commit -m "feat: FinanceWidget uses useFinance hook instead of inline mock"
```

---

## Task 3: Finance page

**Files:**
- Modify: `dashboard/app/dashboard/finance/page.tsx`

Budget bar full-width top, then two-column row: net worth `ComposedChart` left, expense history right.

- [ ] **Step 1: Replace file contents**

```typescript
// dashboard/app/dashboard/finance/page.tsx
'use client'
import { ComposedChart, Area, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import useFinance from '@/hooks/useFinance'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'

const MONTH_LABELS: Record<string, string> = {
  '01': 'sty', '02': 'lut', '03': 'mar', '04': 'kwi',
  '05': 'maj', '06': 'cze', '07': 'lip', '08': 'sie',
  '09': 'wrz', '10': 'paź', '11': 'lis', '12': 'gru',
}

const CATEGORY_LABELS: Record<string, string> = {
  food: 'jedzenie',
  transport: 'transport',
  entertainment: 'rozrywka',
  health: 'zdrowie',
  housing: 'mieszkanie',
  other: 'inne',
}

function formatMonth(dateStr: string): string {
  return MONTH_LABELS[dateStr.slice(5, 7)] ?? dateStr
}

function formatPolishDate(isoStr: string): string {
  const date = new Date(isoStr)
  const days = ['nie', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob']
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${days[date.getDay()]} ${dd}.${mm}`
}

function formatK(value: number): string {
  return value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
}

export default function FinancePage() {
  const { monthlyBudget, spent, expenses, netWorthHistory } = useFinance()
  const pct = Math.round((spent / monthlyBudget) * 100)

  const chartData = netWorthHistory.map(s => ({
    month: formatMonth(s.date),
    cash_pln: s.cash_pln,
    investments: s.investments,
    crypto_pln: s.crypto_pln,
    liabilities: s.liabilities,
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
      {/* Row 1: Budget bar full width */}
      <div className="card-beige px-5 py-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Budżet miesiąca</span>
          <span className="text-[#1E2D1A] text-sm font-medium">{pct}%</span>
        </div>
        <ProgressBar value={pct} color={pct > 90 ? '#8B3A3A' : pct > 70 ? '#C8A87A' : '#5C7A4E'} height={10} />
        <span className="text-[#5C7A4E] text-xs">
          {spent.toLocaleString('pl-PL')} / {monthlyBudget.toLocaleString('pl-PL')} zł
        </span>
      </div>

      {/* Row 2: Chart (left) + History (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Net worth stacked chart */}
        <div className="card-green px-5 py-4 flex flex-col gap-3">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Majątek netto</span>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DAE8D4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#5C7A4E' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatK} tick={{ fontSize: 10, fill: '#5C7A4E' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#F5EAD8', border: 'none', borderRadius: 8, fontSize: 11 }}
                formatter={(value, name) => [`${Number(value).toLocaleString('pl-PL')} zł`, String(name)]}
              />
              <Area type="monotone" dataKey="cash_pln"    stackId="nw" fill="#B8CDB2" stroke="#B8CDB2" name="Gotówka" />
              <Area type="monotone" dataKey="investments"  stackId="nw" fill="#5C7A4E" stroke="#5C7A4E" name="Inwestycje" />
              <Area type="monotone" dataKey="crypto_pln"   stackId="nw" fill="#3D5C35" stroke="#3D5C35" name="Krypto" />
              <Line  type="monotone" dataKey="liabilities" stroke="#8B3A3A" strokeDasharray="4 2" strokeWidth={2} dot={false} name="Zobowiązania" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Expense history */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Historia wydatków</span>
          {expenses.map((e) => (
            <div key={e.id} className="card-beige px-4 py-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[#1E2D1A] text-sm font-medium">{formatPolishDate(e.created_at)}</span>
                <span className="text-[#5C7A4E] text-xs">{e.note}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{CATEGORY_LABELS[e.category] ?? e.category}</Badge>
                <span className="text-[#1E2D1A] text-sm font-medium">{Number(e.amount).toFixed(2)} zł</span>
              </div>
            </div>
          ))}
        </div>

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
git add dashboard/app/dashboard/finance/page.tsx
git commit -m "feat: implement finance page with budget bar, net worth chart, and expense history"
```

---

## Task 4: Visual verification

- [ ] **Step 1: Start dev server**

```bash
cd E:/Projekty/LifeOS/dashboard && npm run dev
```

Expected: `✓ Ready` on port 3000

- [ ] **Step 2: Verify home dashboard at `http://localhost:3000/dashboard`**

`FinanceWidget` should still render: budget bar (73%), net worth "46 000 zł", last expense "34.50 zł jedzenie Biedronka".

- [ ] **Step 3: Verify finance page at `http://localhost:3000/dashboard/finance`**

Check:
- Full-width budget bar: "73% · 2 190 / 3 000 zł" in amber color
- Left column: stacked area chart with 3 green shades + dashed red liabilities line, 6 months (lis → kwi)
- Right column: 10 expense rows, Polish dates, category badges, amounts
- BottomNav "Finanse" tab active
- Background `#EFF5EC`

- [ ] **Step 4: Stop dev server after verification**
