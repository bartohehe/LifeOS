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
