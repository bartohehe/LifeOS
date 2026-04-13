'use client'
import { useState, useEffect } from 'react'
export default function ClockWidget() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  return <div style={{ fontFamily: 'Georgia, serif', fontSize: 96, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>{hh}:{mm}</div>
}
