'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ActiveLayout from '@/components/layout/ActiveLayout'

const RETURN_DELAY_MS = 3 * 60 * 1000 // 3 minutes

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => router.push('/'), RETURN_DELAY_MS)
  }, [router])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [startTimer])

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      onMouseMove={startTimer}
      onTouchStart={startTimer}
    >
      <ActiveLayout>{children}</ActiveLayout>
    </div>
  )
}
