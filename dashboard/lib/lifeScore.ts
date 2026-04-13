import type { LifeScoreData, ScoreInputs } from './types'
export function calculateLifeScore(inputs: ScoreInputs): LifeScoreData {
  const sleepScore   = Math.min(100, (inputs.avgSleepHours / 8) * 100)
  const workoutScore = Math.min(100, (inputs.workoutsThisWeek / 4) * 100)
  const budgetScore  = Math.max(0, 100 - inputs.budgetOverrunPct * 2)
  const habitScore   = Math.min(100, (inputs.habitStreakDays / 7) * 100)
  const score = Math.round(sleepScore * 0.25 + workoutScore * 0.25 + budgetScore * 0.25 + habitScore * 0.25)
  return { score, sleepScore, workoutScore, budgetScore, habitScore }
}
export function scoreColor(score: number): string {
  if (score >= 80) return '#5C7A4E'
  if (score >= 60) return '#C8A87A'
  return '#8B3A3A'
}
