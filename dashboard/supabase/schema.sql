-- LifeOS Dashboard — Supabase Schema

CREATE TABLE IF NOT EXISTS workouts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  date         date NOT NULL,
  duration_min int,
  rpe          int CHECK (rpe BETWEEN 1 AND 10),
  notes        text
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise   text NOT NULL,
  set_number int,
  weight_kg  numeric(5,2),
  reps       int
);

CREATE TABLE IF NOT EXISTS expenses (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  amount     numeric(10,2) NOT NULL,
  category   text CHECK (category IN ('food','transport','entertainment','health','housing','other')),
  note       text,
  is_fixed   boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS daily_stats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date UNIQUE NOT NULL,
  sleep_hours numeric(3,1),
  mood        int CHECK (mood BETWEEN 1 AND 10),
  life_score  int
);

CREATE TABLE IF NOT EXISTS net_worth_snapshots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  cash_pln    numeric(12,2) NOT NULL DEFAULT 0,
  investments numeric(12,2) NOT NULL DEFAULT 0,
  crypto_pln  numeric(12,2) NOT NULL DEFAULT 0,
  liabilities numeric(12,2) NOT NULL DEFAULT 0,
  total       numeric(12,2) GENERATED ALWAYS AS (cash_pln + investments + crypto_pln - liabilities) STORED
);
