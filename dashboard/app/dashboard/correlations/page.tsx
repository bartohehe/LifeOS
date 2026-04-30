'use client'
import { useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import useCorrelations from '@/hooks/useCorrelations'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}`
}

// ── Sub-component: one dual-line chart card ───────────────────────────────────

interface ChartCardProps {
  title: string
  data: Record<string, unknown>[]
  leftKey: string
  leftColor: string
  leftLabel: string
  leftDomain?: [number | string, number | string]
  rightKey: string
  rightColor: string
  rightLabel: string
  rightDomain?: [number | string, number | string]
  currencyKey?: string   // whichever dataKey should render as PLN in the tooltip
}

function ChartCard({
  title,
  data,
  leftKey,
  leftColor,
  leftLabel,
  leftDomain,
  rightKey,
  rightColor,
  rightLabel,
  rightDomain,
  currencyKey,
}: ChartCardProps) {
  return (
    <div className="card-green px-4 py-3 flex flex-col gap-2" style={{ minWidth: 0 }}>
      <span className="text-[#3D5C35] text-xs uppercase tracking-widest">{title}</span>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 36, left: -12, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: '#5C7A4E' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={leftDomain}
              tick={{ fontSize: 10, fill: leftColor }}
              axisLine={false}
              tickLine={false}
              width={32}
              label={{ value: leftLabel, angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 9, fill: leftColor } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={rightDomain}
              tick={{ fontSize: 10, fill: rightColor }}
              axisLine={false}
              tickLine={false}
              width={36}
              label={{ value: rightLabel, angle: 90, position: 'insideRight', offset: 12, style: { fontSize: 9, fill: rightColor } }}
            />
            <Tooltip
              contentStyle={{ background: '#EFF5EC', border: '1px solid #DAE8D4', borderRadius: 8, fontSize: 11 }}
              formatter={(value: string | number, name: string | number) => {
                if (currencyKey && name === currencyKey) {
                  return [`${Number(value).toLocaleString('pl-PL')} zł`, String(name)]
                }
                return [String(value), String(name)]
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={leftKey}
              stroke={leftColor}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={rightKey}
              stroke={rightColor}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const RANGE_OPTIONS: Array<7 | 14 | 30> = [7, 14, 30]

export default function CorrelationsPage() {
  const [days, setDays] = useState<7 | 14 | 30>(7)
  const { data } = useCorrelations(days)

  // Recharts requires plain objects — CorrelationEntry satisfies this
  const chartData = data as unknown as Record<string, unknown>[]

  return (
    <div
      className="w-full h-full flex flex-col gap-4"
      style={{ background: '#EFF5EC', padding: 24 }}
    >
      {/* Range selector */}
      <div className="flex gap-2">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setDays(opt)}
            className={opt === days ? 'card-green px-4 py-1.5 text-sm font-medium text-[#1E2D1A]' : 'card-beige px-4 py-1.5 text-sm text-[#5C7A4E]'}
            style={{ borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            {opt}d
          </button>
        ))}
      </div>

      {/* 2×2 chart grid */}
      <div className="grid grid-cols-2 gap-4 flex-1" style={{ minHeight: 0 }}>
        <ChartCard
          title="Sen → Nastrój"
          data={chartData}
          leftKey="sleep_hours"
          leftColor="#5C7A4E"
          leftLabel="godz."
          rightKey="mood"
          rightColor="#C8A87A"
          rightLabel="nastrój"
          rightDomain={[0, 10]}
        />
        <ChartCard
          title="Sen → Life Score"
          data={chartData}
          leftKey="sleep_hours"
          leftColor="#5C7A4E"
          leftLabel="godz."
          rightKey="life_score"
          rightColor="#3D5C35"
          rightLabel="score"
          rightDomain={[0, 100]}
        />
        <ChartCard
          title="Trening → Nastrój"
          data={chartData}
          leftKey="workout_rpe"
          leftColor="#8B3A3A"
          leftLabel="RPE"
          leftDomain={[0, 10]}
          rightKey="mood"
          rightColor="#C8A87A"
          rightLabel="nastrój"
          rightDomain={[0, 10]}
        />
        <ChartCard
          title="Wydatki → Life Score"
          data={chartData}
          leftKey="daily_spend"
          leftColor="#C8A87A"
          leftLabel="zł"
          rightKey="life_score"
          rightColor="#3D5C35"
          rightLabel="score"
          rightDomain={[0, 100]}
          currencyKey="daily_spend"
        />
      </div>
    </div>
  )
}
