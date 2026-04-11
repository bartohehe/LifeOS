import Badge from '../ui/Badge'
import useAuth from '../../hooks/useAuth'
import useStats from '../../hooks/useStats'

export default function TopBar() {
  const { user } = useAuth()
  const { player } = useStats()

  return (
    <header className="h-14 flex items-center justify-end px-6 border-b border-glass-border gap-4">
      {player && (
        <Badge variant="violet">Level {player.level}</Badge>
      )}
      <span className="text-sm text-offwhite-muted">
        {user?.username ?? '—'}
      </span>
    </header>
  )
}
