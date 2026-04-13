import type { TimeOfDay } from './types'
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8)  return 'dawn'
  if (hour >= 8 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'sunset'
  return 'night'
}
export const BG_GRADIENTS: Record<TimeOfDay, string> = {
  dawn:   'linear-gradient(180deg, #B8CDB2 0%, #EFF5EC 100%)',
  day:    'linear-gradient(180deg, #EFF5EC 0%, #DAE8D4 100%)',
  sunset: 'linear-gradient(180deg, #C8A882 0%, #5C4033 100%)',
  night:  'linear-gradient(180deg, #1A2318 0%, #0D150B 100%)',
}
export function textColorForTime(tod: TimeOfDay): string {
  return tod === 'night' || tod === 'sunset' ? '#EFF5EC' : '#1E2D1A'
}
