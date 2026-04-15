'use client'
import React from 'react'
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react'
import useWeather from '@/hooks/useWeather'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number | string; color?: string }>> = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  wind: Wind,
}

export default function WeatherWidget() {
  const { weather } = useWeather('Wroclaw')
  if (!weather) return null

  const Icon = ICON_MAP[weather.condition] ?? Cloud

  return (
    <div className="card-green px-5 py-4 flex flex-col gap-1 min-w-[160px]">
      <div className="flex items-center gap-2">
        <Icon size={28} color="#3D5C35" />
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>
          {weather.temp}°
        </span>
      </div>
      <span className="text-[#3D5C35] text-sm capitalize">{weather.condition}</span>
      <span className="text-[#5C7A4E] text-xs">{weather.location}</span>
      <div className="flex gap-3 mt-1">
        <span className="text-[#5C7A4E] text-xs">{weather.humidity}% wilg.</span>
        <span className="text-[#5C7A4E] text-xs">{weather.windSpeed} km/h</span>
      </div>
    </div>
  )
}
