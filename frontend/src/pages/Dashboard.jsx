import GlassCard from '../components/ui/GlassCard'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-offwhite">Dashboard</h1>
      <GlassCard>
        <p className="text-offwhite-muted text-sm">Dashboard widgets — sprint pending</p>
      </GlassCard>
    </div>
  )
}
