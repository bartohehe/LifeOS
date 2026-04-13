'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PassiveLayout from '@/components/layout/PassiveLayout'
import { getTimeOfDay, BG_GRADIENTS, textColorForTime } from '@/lib/timeOfDay'

const DIM_DELAY_MS = 5 * 60 * 1000 // 5 minutes

export default function PassivePage() {
  const router = useRouter()
  const [isDimmed, setIsDimmed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsDimmed(true), DIM_DELAY_MS)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [startTimer])

  const handleActivity = () => {
    if (isDimmed) {
      setIsDimmed(false)
      startTimer()
      return
    }
    startTimer()
  }

  const handleClick = () => {
    if (isDimmed) {
      setIsDimmed(false)
      startTimer()
      return
    }
    router.push('/dashboard')
  }

  const tod = getTimeOfDay(new Date().getHours())
  const bg = BG_GRADIENTS[tod]
  const textColor = textColorForTime(tod)

  return (
    <div
      className={`w-screen h-screen overflow-hidden cursor-pointer select-none transition-opacity duration-1000 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
      style={{ background: bg }}
      onMouseMove={handleActivity}
      onTouchStart={handleActivity}
      onClick={handleClick}
    >
      <PassiveLayout textColor={textColor} />
    </div>
  )
}
