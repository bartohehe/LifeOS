'use client'
import { useState } from 'react'
import type { Weather } from '@/lib/types'

export interface WeatherData extends Weather {
  humidity: number
}

const MOCK: WeatherData = {
  temp: 18,
  condition: 'cloudy',
  location: 'Warszawa',
  humidity: 65,
  windSpeed: 12,
  icon: 'cloud',
}

export default function useWeather(_location: string): {
  weather: WeatherData | null
  error: string | null
} {
  // MOCK MODE — replace these two lines with the real API block below when ready
  const [weather] = useState<WeatherData | null>(MOCK)
  const [error] = useState<string | null>(null)

  // --- Real API (uncomment + remove mock useState lines above) ---
  // import { useEffect } from 'react' — add to imports
  // const [weather, setWeather] = useState<WeatherData | null>(null)
  // const [error, setError] = useState<string | null>(null)
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const res = await fetch(`/api/weather?city=${_location}`)
  //       if (!res.ok) throw new Error(`Weather API ${res.status}`)
  //       setWeather(await res.json())
  //     } catch (e) {
  //       setError(e instanceof Error ? e.message : 'Unknown error')
  //     }
  //   }
  //   load()
  //   const t = setInterval(load, 60 * 60 * 1000) // refresh every 60 min
  //   return () => clearInterval(t)
  // }, [_location])

  return { weather, error }
}
