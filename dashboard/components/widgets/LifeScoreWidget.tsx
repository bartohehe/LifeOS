'use client'
import useLifeScore from '@/hooks/useLifeScore'
import ProgressBar from '@/components/ui/ProgressBar'
import { scoreColor } from '@/lib/lifeScore'
import type { LifeScoreData } from '@/lib/types'

const BARS: { key: keyof Omit<LifeScoreData, 'score'>; label: string }[] = [
  { key: 'sleepScore', label: 'Sen' },
  { key: 'workoutScore', label: 'Trening' },
  { key: 'budgetScore', label: 'Budżet' },
  { key: 'habitScore', label: 'Nawyki' },
]

interface LifeScoreWidgetProps {
  size?: 'full' | 'small'
}

export default function LifeScoreWidget({ size = 'full' }: LifeScoreWidgetProps) {
  const { data } = useLifeScore()
  if (!data) return null

  const color = scoreColor(data.score)

  return (
    <div className={`card-beige px-5 py-4 flex flex-col gap-3 ${size === 'small' ? 'min-w-[140px]' : 'min-w-[180px]'}`}>
      <div>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: size === 'small' ? 48 : 56, fontWeight: 700, color, lineHeight: 1 }}>
          {data.score}
        </span>
        <span className="block text-[#3D5C35] text-xs uppercase tracking-widest mt-1">
          Life Score
        </span>
      </div>
      {size === 'full' && (
        <div className="flex flex-col gap-2">
          {BARS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-[#5C7A4E] text-xs">{label}</span>
                <span className="text-[#5C7A4E] text-xs">{Math.round(data[key])}</span>
              </div>
              <ProgressBar value={data[key]} color={scoreColor(data[key])} height={6} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
