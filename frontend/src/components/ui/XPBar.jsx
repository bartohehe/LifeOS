export default function XPBar({ current, max, className = '' }) {
  const pct = Math.min(100, Math.round((current / max) * 100))

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="bg-void-800 rounded-full h-2 overflow-hidden">
        <div
          className="xp-bar h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-offwhite-subtle">
        <span>{current.toLocaleString()} XP</span>
        <span>{max.toLocaleString()} XP</span>
      </div>
    </div>
  )
}
