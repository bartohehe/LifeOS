export interface Weather {
  temp: number; condition: string; windSpeed: number; icon: string; location: string
}
export interface AvatarLayers {
  clothing: 'winter' | 'warm' | 'mild' | 'hot' | 'rain'
  accessory: 'umbrella' | 'sunglasses' | 'scarf' | null
  windEffect: boolean
  expression: 'normal' | 'tired' | 'energetic'
  effect: 'yawn' | 'spark' | 'halo' | null
}
export interface LifeScoreData {
  score: number; sleepScore: number; workoutScore: number; budgetScore: number; habitScore: number
}
export interface ScoreInputs {
  avgSleepHours: number; workoutsThisWeek: number; budgetOverrunPct: number; habitStreakDays: number
}
export interface CalendarEvent { title: string; startTime: string; hoursUntil: number }
export interface NetWorthSnapshot { id: string; created_at: string; cash_pln: number; investments: number; crypto_pln: number; liabilities: number; total: number }
export interface DailyStats { id: string; date: string; sleep_hours: number; mood: number; life_score: number }
export interface Workout { id: string; created_at: string; date: string; duration_min: number; rpe: number; notes: string }
export interface Expense { id: string; created_at: string; amount: number; category: string; note: string; is_fixed: boolean }
export type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night'
