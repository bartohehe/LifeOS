'use client'
import { useState, useEffect } from 'react'

interface ClockWidgetProps {
  color?: string
}

export default function ClockWidget({ color = '#1E2D1A' }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  const day = time.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <div className="flex flex-col gap-1">
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 96, fontWeight: 700, color, lineHeight: 1 }}>
        {hh}:{mm}
      </div>
      <div style={{ fontFamily: 'Calibri, sans-serif', fontSize: 16, color, opacity: 0.7, textTransform: 'capitalize' }}>
        {day}
      </div>
    </div>
  )
}
