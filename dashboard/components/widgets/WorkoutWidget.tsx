// dashboard/components/widgets/WorkoutWidget.tsx
'use client'
import useWorkout from '@/hooks/useWorkout'
import Badge from '@/components/ui/Badge'

function relativeDate(dateStr: string): string {
  const today = new Date()
  const d = new Date(dateStr + 'T00:00:00')
  const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'dziś'
  if (diffDays === 1) return 'wczoraj'
  return `${diffDays} dni temu`
}

export default function WorkoutWidget() {
  const { lastWorkout } = useWorkout()
  if (!lastWorkout) return null

  return (
    <div className="card-green px-5 py-4 flex flex-col gap-3 h-full">
      <span className="text-[#3D5C35] text-xs uppercase tracking-widest">
        Ostatni trening
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[#1E2D1A] text-sm font-medium">{relativeDate(lastWorkout.date)}</span>
        <span className="text-[#5C7A4E] text-sm">{lastWorkout.duration_min} min</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#5C7A4E] text-xs">RPE</span>
        <Badge>{lastWorkout.rpe}/10</Badge>
      </div>
      <div className="flex flex-col gap-1">
        {lastWorkout.exercises.map((ex) => (
          <span key={ex} className="text-[#3D5C35] text-sm">· {ex}</span>
        ))}
      </div>
    </div>
  )
}
