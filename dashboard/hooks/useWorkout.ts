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

  // MOCK MODE — remove useMemo and uncomment Supabase block above when ready
  return useMemo(() => ({
    lastWorkout: MOCK_HISTORY[0],
    history: MOCK_HISTORY,
    currentWeight: MOCK_WEIGHT,
    loading: false,
  }), [])
}
