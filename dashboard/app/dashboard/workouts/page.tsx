// dashboard/app/dashboard/workouts/page.tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import useWorkout from '@/hooks/useWorkout'
import Badge from '@/components/ui/Badge'

function formatPolishDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const days = ['nie', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob']
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${days[date.getDay()]} ${dd}.${mm}`
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function WorkoutsPage() {
  const { history, currentWeight } = useWorkout()

  const chartData = history.slice(0, 8).reverse().map(w => ({
    date: formatShortDate(w.date),
    rpe: w.rpe,
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
      {/* Top row: weight + chart */}
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Weight card */}
        <div className="card-beige px-5 py-4 flex flex-col gap-2" style={{ minWidth: 180 }}>
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Aktualna waga</span>
          <div className="flex items-baseline gap-1">
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>
              {currentWeight ?? '—'}
            </span>
            <span className="text-[#5C7A4E] text-sm">kg</span>
          </div>
          <span className="text-[#5C7A4E] text-xs">↓ 1.2 kg od początku miesiąca</span>
        </div>

        {/* RPE chart */}
        <div className="card-green px-5 py-4 flex flex-col gap-3" style={{ flex: 1 }}>
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">RPE — ostatnie treningi</span>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DAE8D4" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#5C7A4E' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tick={{ fontSize: 10, fill: '#5C7A4E' }} axisLine={false} tickLine={false} />
              <Bar dataKey="rpe" fill="#5C7A4E" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History list */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Historia treningów</span>
        {history.map((w) => (
          <div key={w.id} className="card-green px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#1E2D1A] text-sm font-medium">{formatPolishDate(w.date)}</span>
              <span className="text-[#5C7A4E] text-xs">{w.exercises.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#5C7A4E] text-sm">{w.duration_min} min</span>
              <Badge>RPE {w.rpe}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
