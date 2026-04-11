import GlassCard from '../components/ui/GlassCard'

export default function Timeline() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-offwhite">Timeline</h1>
      <GlassCard>
        <p className="text-offwhite-muted text-sm">Activity timeline — sprint pending</p>
      </GlassCard>
    </div>
  )
}
