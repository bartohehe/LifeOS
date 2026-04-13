import { useMemo } from 'react'
import { calculateLifeScore } from '@/lib/lifeScore'
import type { LifeScoreData } from '@/lib/types'

const MOCK_INPUTS = {
  avgSleepHours: 7,
  workoutsThisWeek: 2,
  budgetOverrunPct: 10,
  habitStreakDays: 5,
}
// → score: 72, sleep: 87, workout: 50, budget: 80, habit: 71

export default function useLifeScore(): {
  data: LifeScoreData | null
  error: string | null
} {
  // MOCK MODE — remove useMemo line and uncomment the real API block below when ready
  const data = useMemo(() => calculateLifeScore(MOCK_INPUTS), [])
  const error: string | null = null

  // --- Real API (uncomment + remove mock lines above) ---
  // import { useState, useEffect } from 'react' — add to imports
  // const [data, setData] = useState<LifeScoreData | null>(null)
  // const [error, setError] = useState<string | null>(null)
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const res = await fetch('/api/scores')
  //       if (!res.ok) throw new Error(`Scores API ${res.status}`)
  //       setData(await res.json())
  //     } catch (e) {
  //       setError(e instanceof Error ? e.message : 'Unknown error')
  //     }
  //   }
  //   load()
  //   const t = setInterval(load, 15 * 60 * 1000) // refresh every 15 min
  //   return () => clearInterval(t)
  // }, [])

  return { data, error }
}
