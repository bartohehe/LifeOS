'use client'
import { motion } from 'framer-motion'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import ClockWidget from '@/components/widgets/ClockWidget'
import LifeScoreWidget from '@/components/widgets/LifeScoreWidget'
import WorkoutWidget from '@/components/widgets/WorkoutWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'
import CalendarWidget from '@/components/widgets/CalendarWidget'

function AvatarCard() {
  return (
    <div className="card-green flex items-center justify-center h-full" style={{ minHeight: 200 }}>
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar placeholder">
        <circle cx="60" cy="28" r="22" fill="#3D5C35" />
        <rect x="38" y="54" width="44" height="50" rx="10" fill="#3D5C35" />
        <rect x="18" y="56" width="18" height="36" rx="8" fill="#3D5C35" />
        <rect x="84" y="56" width="18" height="36" rx="8" fill="#3D5C35" />
        <rect x="40" y="100" width="16" height="40" rx="8" fill="#3D5C35" />
        <rect x="64" y="100" width="16" height="40" rx="8" fill="#3D5C35" />
      </svg>
    </div>
  )
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function DashboardHome() {
  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        background: '#EFF5EC',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gridTemplateRows: 'auto 1fr auto',
        gap: 16,
      }}
    >
      {/* Row 1, Col 1: Avatar */}
      <motion.div {...fadeUp(0)}>
        <AvatarCard />
      </motion.div>

      {/* Row 1, Col 2: Weather + Clock + LifeScore */}
      <motion.div className="flex gap-4" {...fadeUp(0.05)}>
        <WeatherWidget />
        <div className="ml-auto">
          <ClockWidget color="#1E2D1A" />
        </div>
        <div className="ml-auto">
          <LifeScoreWidget size="full" />
        </div>
      </motion.div>

      {/* Row 2, Col 1: Workout */}
      <motion.div {...fadeUp(0.10)}>
        <WorkoutWidget />
      </motion.div>

      {/* Row 2, Col 2: Finance */}
      <motion.div {...fadeUp(0.15)}>
        <FinanceWidget />
      </motion.div>

      {/* Row 3: Calendar — full width */}
      <motion.div className="col-span-2" {...fadeUp(0.20)}>
        <CalendarWidget />
      </motion.div>
    </div>
  )
}
