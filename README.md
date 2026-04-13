# LifeOS Dashboard

> Twoje życie, zwizualizowane. / *Your life, visualized.*

---

## Polski

### Czym jest LifeOS?

LifeOS to osobisty dashboard życiowy zaprojektowany do działania jako kiosk na Raspberry Pi. Wyświetla dane o codziennym życiu — sen, treningi, finanse, nawyki — w estetycznym stylu lo-fi forest. Dane są zawsze pod ręką, bez potrzeby otwierania telefonu.

### Funkcje

- **Passive mode** — tryb zawsze włączony: zegar, pogoda, avatar, Life Score. Automatyczne przyciemnienie po 5 minutach bezczynności.
- **Active mode** — pełny dashboard z widgetami, nawigacją i szczegółowymi danymi.
- **Life Score** — syntetyczny wskaźnik (0–100) wyliczany z 4 komponentów: sen, treningi, budżet, nawyki.
- **Avatar** — postać reagująca na pogodę i dane życiowe (warstwy PNG: baza, ubranie, akcesoria, mimika, efekt).
- **Treningi** — historia ćwiczeń, serie, RPE.
- **Finanse** — wydatki, kategorie, majątek netto.
- **Korelacje** — wykresy zależności między danymi życiowymi.

### Stack technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend + API | Next.js 14 (App Router), TypeScript |
| Stylowanie | Tailwind CSS v3, Framer Motion |
| Wykresy | Recharts |
| Baza danych | Supabase (PostgreSQL + real-time) |
| Deployment | Raspberry Pi, Docker, Node.js 20 LTS |

### Design

Styl **lo-fi forest** — stonowane zielenie, beżowe karty, typografia szeryfowa (Georgia). Tło zmienia się z porą dnia: świt, dzień, zachód słońca, noc.

### Szybki start

```bash
# 1. Sklonuj repozytorium
git clone <repo-url>
cd LifeOS/dashboard

# 2. Zainstaluj zależności
npm install

# 3. Skonfiguruj zmienne środowiskowe
cp .env.local.example .env.local
# Uzupełnij NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Uruchom bazę danych (Supabase)
# Wklej zawartość supabase/schema.sql do edytora SQL w Supabase

# 5. Uruchom serwer deweloperski
npm run dev
# → http://localhost:3000
```

### Struktura projektu

```
LifeOS/
├── dashboard/              # Aplikacja Next.js 14
│   ├── app/                # Strony i API routes
│   │   ├── page.tsx        # Passive mode (/)
│   │   ├── dashboard/      # Active mode (/dashboard)
│   │   └── api/            # Proxy pogody, Life Score, jasność
│   ├── components/
│   │   ├── avatar/         # System warstw avatara
│   │   ├── widgets/        # Zegar, pogoda, Life Score, kalendarz...
│   │   ├── layout/         # PassiveLayout, ActiveLayout, BottomNav
│   │   └── ui/             # Card, Badge, ProgressBar
│   ├── hooks/              # useWeather, useLifeScore, useSupabase
│   ├── lib/                # Typy, logika, klient Supabase
│   └── supabase/           # Schema SQL
└── docs/                   # Plany i specyfikacje sprintów
```

---

## English

### What is LifeOS?

LifeOS is a personal life dashboard designed to run as a kiosk on Raspberry Pi. It displays daily life data — sleep, workouts, finances, habits — in a lo-fi forest aesthetic. Your data is always visible, without reaching for your phone.

### Features

- **Passive mode** — always-on kiosk: clock, weather, avatar, Life Score. Auto-dims after 5 minutes of inactivity.
- **Active mode** — full dashboard with widgets, navigation and detailed data.
- **Life Score** — synthetic indicator (0–100) calculated from 4 components: sleep, workouts, budget, habits.
- **Avatar** — character reacting to weather and life data (PNG layers: base, clothing, accessories, expression, effect).
- **Workouts** — exercise history, sets, RPE tracking.
- **Finances** — expenses, categories, net worth snapshots.
- **Correlations** — charts showing relationships between life metrics.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend + API | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3, Framer Motion |
| Charts | Recharts |
| Database | Supabase (PostgreSQL + real-time) |
| Deployment | Raspberry Pi, Docker, Node.js 20 LTS |

### Design

**Lo-fi forest** style — muted greens, beige cards, serif typography (Georgia). Background shifts with time of day: dawn, day, sunset, night.

### Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd LifeOS/dashboard

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Set up the database (Supabase)
# Paste the contents of supabase/schema.sql into the Supabase SQL editor

# 5. Start the development server
npm run dev
# → http://localhost:3000
```

### Project Structure

```
LifeOS/
├── dashboard/              # Next.js 14 application
│   ├── app/                # Pages and API routes
│   │   ├── page.tsx        # Passive mode (/)
│   │   ├── dashboard/      # Active mode (/dashboard)
│   │   └── api/            # Weather proxy, Life Score, brightness
│   ├── components/
│   │   ├── avatar/         # Avatar layer system
│   │   ├── widgets/        # Clock, weather, Life Score, calendar...
│   │   ├── layout/         # PassiveLayout, ActiveLayout, BottomNav
│   │   └── ui/             # Card, Badge, ProgressBar
│   ├── hooks/              # useWeather, useLifeScore, useSupabase
│   ├── lib/                # Types, logic, Supabase client
│   └── supabase/           # SQL schema
└── docs/                   # Sprint plans and specs
```

### Life Score Algorithm

```
score = (sleepScore × 0.25) + (workoutScore × 0.25) + (budgetScore × 0.25) + (habitScore × 0.25)

sleepScore   = min(100, avgSleepHours / 8 × 100)
workoutScore = min(100, workoutsThisWeek / 4 × 100)
budgetScore  = max(0,   100 - budgetOverrunPct × 2)
habitScore   = min(100, habitStreakDays / 7 × 100)
```

Score colors: `≥ 80` green · `≥ 60` amber · `< 60` red

### Raspberry Pi Kiosk Setup

```bash
# Build and run the production container
docker compose up --build

# The dashboard runs on port 3000
# Configure Chromium in kiosk mode pointing to http://localhost:3000
```

---

*Built with Next.js 14 · Powered by Supabase · Deployed on Raspberry Pi*
