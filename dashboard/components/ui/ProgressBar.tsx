interface ProgressBarProps { value: number; color?: string; height?: number; showLabel?: boolean; className?: string }
export default function ProgressBar({ value, color = '#5C7A4E', height = 12, showLabel = false, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="w-full rounded-full overflow-hidden bg-[#B8CDB2]" style={{ height }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {showLabel && <span className="text-[14px] font-mono text-right text-[#3D5C35]">{pct}%</span>}
    </div>
  )
}
