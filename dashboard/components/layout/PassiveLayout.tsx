import ClockWidget from '@/components/widgets/ClockWidget'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import LifeScoreWidget from '@/components/widgets/LifeScoreWidget'

function AvatarPlaceholder() {
  return (
    <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar placeholder">
      {/* head */}
      <circle cx="60" cy="28" r="22" fill="#3D5C35" />
      {/* body */}
      <rect x="38" y="54" width="44" height="50" rx="10" fill="#3D5C35" />
      {/* left arm */}
      <rect x="18" y="56" width="18" height="36" rx="8" fill="#3D5C35" />
      {/* right arm */}
      <rect x="84" y="56" width="18" height="36" rx="8" fill="#3D5C35" />
      {/* left leg */}
      <rect x="40" y="100" width="16" height="40" rx="8" fill="#3D5C35" />
      {/* right leg */}
      <rect x="64" y="100" width="16" height="40" rx="8" fill="#3D5C35" />
    </svg>
  )
}

interface PassiveLayoutProps {
  textColor: string
}

export default function PassiveLayout({ textColor }: PassiveLayoutProps) {
  return (
    <div
      className="w-full h-full grid"
      style={{ gridTemplateRows: '1fr 2fr 1fr', padding: 40, gap: 24 }}
    >
      {/* Top row: clock left, weather right */}
      <div className="flex justify-between items-start">
        <ClockWidget color={textColor} />
        <WeatherWidget />
      </div>

      {/* Middle row: avatar centered */}
      <div className="flex items-center justify-center">
        <AvatarPlaceholder />
      </div>

      {/* Bottom row: life score left, reserved right */}
      <div className="flex justify-between items-end">
        <LifeScoreWidget />
        <div /> {/* future: CalendarWidget or LofiRadio */}
      </div>
    </div>
  )
}
