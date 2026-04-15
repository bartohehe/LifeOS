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

  // MOCK MODE — remove useMemo and uncomment Supabase block above when ready
  return useMemo(() => ({
    monthlyBudget: 3000,
    spent: 2190,
    expenses: MOCK_EXPENSES,
    netWorthHistory: MOCK_NET_WORTH_HISTORY,
    currentNetWorth: MOCK_NET_WORTH_HISTORY[MOCK_NET_WORTH_HISTORY.length - 1].total,
    loading: false,
  }), [])
}
