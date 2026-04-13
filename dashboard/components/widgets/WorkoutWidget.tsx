'use client'

import Badge from '@/components/ui/Badge'

const MOCK = {
  date: 'wczoraj',
  duration: 45,
  rpe: 7,
  exercises: ['Przysiad', 'Martwy ciąg', 'Wyciskanie'],
}

export default function WorkoutWidget() {
  return (
    <div className="card-green px-5 py-4 flex flex-col gap-3 h-full">
      <span className="text-[#3D5C35] text-xs uppercase tracking-widest">
        Ostatni trening
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[#1E2D1A] text-sm font-medium">{MOCK.date}</span>
        <span className="text-[#5C7A4E] text-sm">{MOCK.duration} min</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#5C7A4E] text-xs">RPE</span>
        <Badge>{MOCK.rpe}/10</Badge>
      </div>
      <div className="flex flex-col gap-1">
        {MOCK.exercises.map((ex) => (
          <span key={ex} className="text-[#3D5C35] text-sm">· {ex}</span>
        ))}
      </div>
    </div>
  )
}
