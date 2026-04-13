# Passive Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the always-on kiosk passive mode at `/` with clock, weather, life score, avatar placeholder, and 5-minute CSS dim + touch-to-navigate behavior.

**Architecture:** `app/page.tsx` (client component) owns dim timer and router logic. `PassiveLayout` owns the grid. Widgets (`WeatherWidget`, `LifeScoreWidget`, `ClockWidget`) are pure display components fed by hooks. All data is mocked; real API code is present but commented out.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, Lucide React, `lib/lifeScore.ts` (calculateLifeScore, scoreColor), `lib/timeOfDay.ts` (getTimeOfDay, BG_GRADIENTS, textColorForTime)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `hooks/useWeather.ts` | Modify | Returns mock WeatherData; real fetch commented out |
| `hooks/useLifeScore.ts` | Modify | Returns calculateLifeScore(mockInputs); real fetch commented out |
| `components/widgets/ClockWidget.tsx` | Modify | Accept optional `color` prop for time-of-day text |
| `components/widgets/WeatherWidget.tsx` | Modify | Display temp, condition icon, location, humidity, wind |
| `components/widgets/LifeScoreWidget.tsx` | Modify | Display score number + 4 component ProgressBars |
| `components/layout/PassiveLayout.tsx` | Modify | Full-screen 3-row grid + inline SVG avatar placeholder |
| `app/page.tsx` | Modify | Dim timer, mouse/touch reset, click-to-navigate |
| `app/api/weather/route.ts` | Modify | Add commented real OpenWeatherMap implementation |

---

## Task 1: useWeather hook

**Files:**
- Modify: `hooks/useWeather.ts`

The hook returns a `WeatherData` object (extends `Weather` from `lib/types.ts` with `humidity`). Mock is active by default; the real polling useEffect is commented out.

**Step 1: Replace hook contents**

```typescript
// hooks/useWeather.ts
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
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors relating to `hooks/useWeather.ts`

**Step 3: Commit**

```bash
git add dashboard/hooks/useWeather.ts
git commit -m "feat: implement useWeather hook with mock data"
```

---

## Task 2: useLifeScore hook

**Files:**
- Modify: `hooks/useLifeScore.ts`

Returns `LifeScoreData` from `calculateLifeScore()` with mock inputs. Real polling fetch is commented out.

**Step 1: Replace hook contents**

```typescript
// hooks/useLifeScore.ts
import { useMemo } from 'react'
import { calculateLifeScore } from '@/lib/lifeScore'
import type { LifeScoreData } from '@/lib/types'

const MOCK_INPUTS = {
  avgSleepHours: 7,
  workoutsThisWeek: 2,
  budgetOverrunPct: 10,
  habitStreakDays: 5,
}
// → score: 72, sleep: 87, workout: 50, budget: 80, habit: 71

export default function useLifeScore(): {
  data: LifeScoreData | null
  error: string | null
} {
  // MOCK MODE — remove useMemo line and uncomment the real API block below when ready
  const data = useMemo(() => calculateLifeScore(MOCK_INPUTS), [])
  const error: string | null = null

  // --- Real API (uncomment + remove mock lines above) ---
  // import { useState, useEffect } from 'react' — add to imports
  // const [data, setData] = useState<LifeScoreData | null>(null)
  // const [error, setError] = useState<string | null>(null)
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const res = await fetch('/api/scores')
  //       if (!res.ok) throw new Error(`Scores API ${res.status}`)
  //       setData(await res.json())
  //     } catch (e) {
  //       setError(e instanceof Error ? e.message : 'Unknown error')
  //     }
  //   }
  //   load()
  //   const t = setInterval(load, 15 * 60 * 1000) // refresh every 15 min
  //   return () => clearInterval(t)
  // }, [])

  return { data, error }
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors relating to `hooks/useLifeScore.ts`

**Step 3: Commit**

```bash
git add dashboard/hooks/useLifeScore.ts
git commit -m "feat: implement useLifeScore hook with mock data"
```

---

## Task 3: ClockWidget — add color prop

**Files:**
- Modify: `components/widgets/ClockWidget.tsx`

ClockWidget currently has hardcoded `#1E2D1A`. On dark night/sunset backgrounds it becomes unreadable. Add an optional `color` prop defaulting to `#1E2D1A`.

**Step 1: Update ClockWidget**

```typescript
// components/widgets/ClockWidget.tsx
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
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/ClockWidget.tsx
git commit -m "feat: add color prop and date line to ClockWidget"
```

---

## Task 4: WeatherWidget

**Files:**
- Modify: `components/widgets/WeatherWidget.tsx`

Uses `useWeather('Warszawa')`. Maps `condition` string to a Lucide icon component.

**Step 1: Implement WeatherWidget**

```typescript
// components/widgets/WeatherWidget.tsx
'use client'
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react'
import useWeather from '@/hooks/useWeather'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  wind: Wind,
}

export default function WeatherWidget() {
  const { weather } = useWeather('Warszawa')
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
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/WeatherWidget.tsx
git commit -m "feat: implement WeatherWidget with mock data"
```

---

## Task 5: LifeScoreWidget

**Files:**
- Modify: `components/widgets/LifeScoreWidget.tsx`

Uses `useLifeScore()`. Displays large score number colored by `scoreColor()`, plus 4 labeled `ProgressBar` components. `ProgressBar` already accepts `value`, `color`, `height` props.

**Step 1: Implement LifeScoreWidget**

```typescript
// components/widgets/LifeScoreWidget.tsx
'use client'
import useLifeScore from '@/hooks/useLifeScore'
import ProgressBar from '@/components/ui/ProgressBar'
import { scoreColor } from '@/lib/lifeScore'
import type { LifeScoreData } from '@/lib/types'

const BARS: { key: keyof Omit<LifeScoreData, 'score'>; label: string }[] = [
  { key: 'sleepScore', label: 'Sen' },
  { key: 'workoutScore', label: 'Trening' },
  { key: 'budgetScore', label: 'Budżet' },
  { key: 'habitScore', label: 'Nawyki' },
]

export default function LifeScoreWidget() {
  const { data } = useLifeScore()
  if (!data) return null

  const color = scoreColor(data.score)

  return (
    <div className="card-beige px-5 py-4 flex flex-col gap-3 min-w-[180px]">
      <div>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 56, fontWeight: 700, color, lineHeight: 1 }}>
          {data.score}
        </span>
        <span className="block text-[#3D5C35] text-xs uppercase tracking-widest mt-1">
          Life Score
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {BARS.map(({ key, label }) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="text-[#5C7A4E] text-xs">{label}</span>
              <span className="text-[#5C7A4E] text-xs">{Math.round(data[key])}</span>
            </div>
            <ProgressBar value={data[key]} color={scoreColor(data[key])} height={6} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/widgets/LifeScoreWidget.tsx
git commit -m "feat: implement LifeScoreWidget with score + component bars"
```

---

## Task 6: PassiveLayout

**Files:**
- Modify: `components/layout/PassiveLayout.tsx`

Replaces the current stub (which imports unused `AvatarSystem` and `LofiRadio`). Full 3-row grid with ClockWidget top-left, WeatherWidget top-right, inline SVG avatar center, LifeScoreWidget bottom-left.

**Step 1: Implement PassiveLayout**

```typescript
// components/layout/PassiveLayout.tsx
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
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/components/layout/PassiveLayout.tsx
git commit -m "feat: implement PassiveLayout with avatar placeholder and widget grid"
```

---

## Task 7: app/page.tsx — dim logic and navigation

**Files:**
- Modify: `app/page.tsx`

Client component. Owns the 5-minute dim timer (CSS opacity). `onMouseMove`/`onTouchStart` resets timer. When dimmed, first interaction wakes (restores opacity). When awake, click navigates to `/dashboard`.

**Step 1: Implement passive page**

```typescript
// app/page.tsx
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
```

**Step 2: Verify TypeScript**

```bash
cd dashboard && npx tsc --noEmit
```

Expected: no errors

**Step 3: Commit**

```bash
git add dashboard/app/page.tsx
git commit -m "feat: implement passive mode page with dim timer and navigation"
```

---

## Task 8: Add commented real weather API implementation

**Files:**
- Modify: `app/api/weather/route.ts`

Adds the real OpenWeatherMap fetch as a commented block so it's ready to activate.

**Step 1: Update weather route**

```typescript
// app/api/weather/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // --- Real API (uncomment when NEXT_PUBLIC_OWM_API_KEY is set in .env.local) ---
  // const { searchParams } = new URL(request.url)
  // const city = searchParams.get('city') ?? 'Warszawa'
  // const apiKey = process.env.OWM_API_KEY
  // if (!apiKey) return NextResponse.json({ error: 'OWM_API_KEY not set' }, { status: 500 })
  // const res = await fetch(
  //   `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
  //   { next: { revalidate: 3600 } }
  // )
  // if (!res.ok) return NextResponse.json({ error: 'OWM fetch failed' }, { status: 502 })
  // const d = await res.json()
  // return NextResponse.json({
  //   temp: Math.round(d.main.temp),
  //   condition: d.weather[0].main.toLowerCase(),
  //   location: d.name,
  //   humidity: d.main.humidity,
  //   windSpeed: Math.round(d.wind.speed * 3.6), // m/s → km/h
  //   icon: d.weather[0].icon,
  // })

  void request
  return NextResponse.json({ error: 'Mock mode — see hooks/useWeather.ts' }, { status: 501 })
}
```

**Step 2: Commit**

```bash
git add dashboard/app/api/weather/route.ts
git commit -m "docs: add commented real OpenWeatherMap implementation to weather route"
```

---

## Task 9: Visual verification

**Step 1: Start dev server**

```bash
cd dashboard && npm run dev
```

Expected output: `ready - started server on 0.0.0.0:3000`

**Step 2: Open browser at `http://localhost:3000`**

Verify:
- Full-screen gradient background matching time of day
- Top-left: large clock + date line
- Top-right: weather card (18°, cloudy, Warszawa, humidity, wind)
- Center: green humanoid SVG avatar
- Bottom-left: Life Score card (72, color #C8A87A amber, 4 bars)
- No scroll, no nav bar

**Step 3: Test dim behavior**

Move mouse away, wait 5 minutes (or temporarily change `DIM_DELAY_MS` to `5000` for testing). Page should fade to 20% opacity. Moving mouse should restore it. Clicking when active should navigate to `/dashboard`.

**Step 4: Restore DIM_DELAY_MS if changed for testing**

```typescript
const DIM_DELAY_MS = 5 * 60 * 1000 // restore to 5 minutes
```

**Step 5: Final commit if any fixes were needed**

```bash
git add -u
git commit -m "fix: passive mode visual adjustments after review"
```
