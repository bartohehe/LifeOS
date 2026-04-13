# Active Mode Home — Design Spec

**Sprint:** 2
**Date:** 2026-04-13
**Status:** Approved

---

## Overview

Active mode is the interactive dashboard at `/dashboard`. It activates when the user taps the passive mode screen. After 3 minutes of inactivity it automatically returns to passive mode (`/`). It displays a full widget grid: avatar, weather, clock, life score, last workout, budget, net worth, last expense, and next calendar event.

---

## Architecture

```
app/dashboard/layout.tsx     — client component, 3-min auto-return timer
  └── ActiveLayout            — wrapper: main (flex-1) + BottomNav (bottom)
       └── app/dashboard/page.tsx  — home widget grid (client component)
```

`DashboardLayout` owns the inactivity timer — it wraps all active mode pages so any tab (Treningi, Finanse, etc.) benefits from auto-return, not just home. Timer resets on any mouse/touch activity anywhere in the layout.

---

## Layout Grid

CSS grid: `gridTemplateColumns: '260px 1fr'`, `gridTemplateRows: 'auto 1fr auto'`, `gap: 16px`, `padding: 24px` (above BottomNav).

```
┌──────────────────────────────────────────────┐
│  [Avatar]  │  [WeatherWidget]  [ClockWidget]  │  ← row 1
│  260px     │  [LifeScoreWidget size="small"]  │
├────────────┼─────────────────────────────────┤
│ [Workout-  │  [FinanceWidget]                 │  ← row 2
│  Widget]   │                                  │
├────────────┴─────────────────────────────────┤
│         [CalendarWidget — col-span-2]         │  ← row 3
├──────────────────────────────────────────────┤
│   🏠 Home  💪 Treningi  💰 Finanse  📊 ...  │  ← BottomNav
└──────────────────────────────────────────────┘
```

Background: solid `#EFF5EC` — active mode is always light, no time-of-day gradient.

Each widget is wrapped in a `motion.div` (Framer Motion) with a stagger fade-up animation:
- `initial: { opacity: 0, y: 16 }`
- `animate: { opacity: 1, y: 0 }`
- `transition: { delay: index * 0.05, duration: 0.3 }`

---

## Auto-Return Timer

`app/dashboard/layout.tsx` becomes a `'use client'` component.

- Delay: `3 * 60 * 1000` ms (3 minutes)
- Events that reset timer: `onMouseMove`, `onTouchStart` on the wrapper div
- On timeout: `router.push('/')`
- No dimming — active mode returns directly, no opacity change
- Timer cleanup on unmount

Same `useCallback` + `useRef` + `useEffect` pattern as passive mode dim timer.

---

## Widget Specifications

### Avatar (Row 1, Col 1)
Inline SVG placeholder from PassiveLayout — same green humanoid silhouette (`#3D5C35`, 120×160px), centered in a `card-green` card (200px tall).
Will be replaced by `AvatarSystem` in a future sprint.

Row 1 right column uses a flex row (`flex gap-4`) to place the 3 widgets side by side:
`WeatherWidget` | `ClockWidget` | `LifeScoreWidget size="small"`

### WeatherWidget (Row 1, Col 2 — leftmost)
Reused from Sprint 1. No changes needed.

### ClockWidget (Row 1, Col 2 — center)
Reused from Sprint 1. Color fixed to `#1E2D1A` (active mode is always light).

### LifeScoreWidget size="small" (Row 1, Col 2 — rightmost)
New `size` prop: `"small" | "full"` (default `"full"`).
- `size="small"`: renders only the large score number + color + "Life Score" label. No progress bars.
- `size="full"`: existing behavior (score + 4 bars) — used in passive mode.
- Passive mode `PassiveLayout` continues using default `size="full"`.

### WorkoutWidget (Row 2, Col 1)
Mock data:
```ts
{ date: 'wczoraj', duration: 45, rpe: 7, exercises: ['Przysiad', 'Martwy ciąg', 'Wyciskanie'] }
```
Displays: label "Ostatni trening", date, duration (min), RPE badge, exercise list.
Card variant: `card-green`.

### FinanceWidget (Row 2, Col 2)
Mock data:
```ts
{ monthlyBudget: 3000, spent: 2190, netWorth: 45200,
  lastExpense: { amount: 34.50, category: 'food', note: 'Biedronka' } }
```
Displays:
- "Budżet miesiąca" label + `ProgressBar` (`spent/monthlyBudget` = 73%) + percentage
- Net worth value in PLN
- Last expense: amount + category badge + note
Card variant: `card-beige`.

### CalendarWidget (Row 3, col-span-2)
Mock data:
```ts
{ title: 'Spotkanie z Marcinem', startTime: '15:00', hoursUntil: 3 }
```
Displays: calendar icon, event title, start time, "za X godz." countdown.
Card variant: `card-green`, full width.

---

## Files Changed

| File | Action |
|------|--------|
| `app/dashboard/layout.tsx` | Modify — add `'use client'`, timer logic |
| `app/dashboard/page.tsx` | Modify — implement widget grid |
| `components/widgets/LifeScoreWidget.tsx` | Modify — add `size` prop |
| `components/widgets/WorkoutWidget.tsx` | Modify — implement with mock data |
| `components/widgets/FinanceWidget.tsx` | Modify — implement with mock data |
| `components/widgets/CalendarWidget.tsx` | Modify — implement with mock data |

---

## Out of Scope (future sprints)

- Real Supabase data for any widget
- AvatarSystem (layered PNGs)
- LofiRadio widget
- Workouts / Finance / Correlations tab pages
- Settings page
