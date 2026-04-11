import GlassCard from '../components/ui/GlassCard'

export default function Profile() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-offwhite">Profile</h1>
      <GlassCard>
        <p className="text-offwhite-muted text-sm">Player stats & level — sprint pending</p>
      </GlassCard>
    </div>
  )
}
