# Passive Mode — Design Spec

**Sprint:** 1
**Date:** 2026-04-13
**Status:** Approved

---

## Overview

Passive mode is the always-on kiosk view at route `/`. It displays ambient life data (clock, weather, life score, avatar) without interaction. After 5 minutes of inactivity it dims to 20% opacity. Any touch/click wakes it; when awake, a click navigates to `/dashboard` (active mode).

---

## Architecture

Follows **Approach B**: `page.tsx` owns dim logic, `PassiveLayout.tsx` owns widget arrangement.

```
app/page.tsx            — client component, dim timer, touch handler, router.push
components/layout/
  PassiveLayout.tsx     — full-screen grid, time-of-day background, widget slots
components/widgets/
  WeatherWidget.tsx     — temp, condition icon, city, humidity, wind (mock data)
  LifeScoreWidget.tsx   — score number + color, 4 component progress bars
  ClockWidget.tsx       — already functional (live tick)
hooks/
  useWeather.ts         — returns mock data; real fetch commented out
  useLifeScore.ts       — calls calculateLifeScore() with mock inputs; real fetch commented out
```

No changes to API routes this sprint — `app/api/weather/route.ts` gets the real implementation commented in as a reference but stays non-functional.

---

## Layout

Full-screen, no scroll, no BottomNav. Background is the time-of-day gradient from `lib/timeOfDay.ts` applied via inline style.

```
┌──────────────────────────────────────┐
│  [ClockWidget]      [WeatherWidget]  │
│                                      │
│         [Avatar placeholder]         │
│                                      │
│  [LifeScoreWidget]      [empty]      │
└──────────────────────────────────────┘
```

- Grid: 3 rows × 2 columns, items pinned to corners, avatar centered in middle row
- Avatar: centered SVG placeholder (simple humanoid silhouette, ~120×120px, `#3D5C35` color)
- All widgets use `.card-green` or `.card-beige` CSS classes from `globals.css`

---

## Dim Behavior

Implemented entirely with CSS `opacity` + `transition`. No `brightnessctl` this sprint.

**States:**
- **Active:** `opacity-100`, 5-min countdown running
- **Dimmed:** `opacity-20 transition-opacity duration-1000`

**Event handling on the wrapper div:**
- `onMouseMove` / `onTouchStart` → `resetTimer()`
- `resetTimer()`:
  - If currently dimmed → set `isDimmed(false)`, return (wake only, no navigate)
  - Otherwise → clear + restart 5-min timeout
- `onClick` (when not dimmed) → `router.push('/dashboard')`

**Timer:** `useRef<NodeJS.Timeout>`, initialized in `useEffect` on mount, cleared on unmount.

---

## WeatherWidget

Displays: temperature (°C), condition label, Lucide weather icon, city name, humidity (%), wind speed (km/h).

Mock data (active by default):
```ts
{ temp: 18, condition: 'cloudy', city: 'Warszawa', humidity: 65, windSpeed: 12 }
```

Hook `useWeather.ts` returns mock directly. Real fetch to `/api/weather` is present but commented out.

Icon mapping (Lucide): `sun` / `cloud` / `cloud-rain` / `cloud-snow` / `wind` based on `condition`.

---

## LifeScoreWidget

Displays: large score number (0–100) with color from `scoreColor()`, label "Life Score", and 4 small labeled progress bars (Sleep, Workout, Budget, Habit).

Mock inputs:
```ts
{ avgSleepHours: 7, workoutsThisWeek: 2, budgetOverrunPct: 10, habitStreakDays: 5 }
// → score: 72
```

Uses `calculateLifeScore()` and `scoreColor()` from `lib/lifeScore.ts` (already implemented).

Hook `useLifeScore.ts` returns mock inputs passed through `calculateLifeScore()`. Real fetch to `/api/scores` is present but commented out.

---

## Avatar Placeholder

Simple inline SVG centered in the middle row. Humanoid silhouette in `#3D5C35` (mid-green from design system). Size: 120×120px. No animation this sprint.

Will be replaced by `AvatarSystem` (layered PNGs) in a future sprint.

---

## Out of Scope (future sprints)

- Real weather API (`OPENWEATHERMAP_API_KEY`)
- Real Life Score from Supabase data
- `brightnessctl` brightness control
- AvatarSystem with weather-driven PNG layers
- LofiRadio widget
- CalendarWidget
