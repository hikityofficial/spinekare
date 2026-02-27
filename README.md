# 🦴 SpineKare

**Medical-grade spine health risk engine & personalised exercise companion.**

SpineKare helps users understand and improve their spine health through a clinically-weighted risk assessment, personalised daily exercise routines, and a gamified tracking system — all in a modern mobile-friendly app.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Spine Risk Assessment** | 8-factor weighted quiz that calculates a score (0–100) with 4-tier categorisation |
| **Daily Routines** | Auto-generated exercise plans personalised to risk tier and streak day |
| **3D Spine Visualiser** | Interactive Three.js model highlighting targeted spinal areas during exercises |
| **Exercise Library** | 12 guided exercises with images, timing, instructions, form cues, and category filtering |
| **Custom Plans** | Build your own exercise sequences from the full library |
| **Gamification** | Points system, daily streaks, weekly leaderboard, and achievement badges |
| **Spine Facts** | Daily rotating spine health facts |
| **Consultation Finder** | Geolocation-based nearby spine clinic suggestions |
| **At-Risk Page** | Nearby hospital finder for high-risk users |

---

## 🧠 Spine Risk Engine v2

### Overview

During onboarding, the user answers **8 lifestyle questions**. Each answer adds or subtracts a weighted score. The final score (0–100) determines their **Spine Risk Tier** and a **Primary Risk Reason**.

### The Algorithm — `calculateSpineRisk(data)`

Located in `src/utils/riskEngine.ts`. Returns:
```ts
{
  score: number;           // 0–100 clamped
  category: RiskCategory;  // 'low' | 'moderate' | 'high' | 'critical'
  primaryReason: string;   // One-sentence explanation of top risk factor
  breakdown: Record<string, number>; // Points per factor
}
```

### Scoring Table

| Factor | Options & Points |
|--------|-----------------|
| **Age** | Under 35: +0 · 35–50: +10 · 50–65: +15 · 65+: +20 |
| **Gender** | Female: +5 (bone density risk) · Male/Other: +0 |
| **Occupation** | Desk job 8+hrs: **+25** · Driver: +20 · Physical labor: +15 · Standing/Student: +0 |
| **Weightlifting** | Construction: +15 · Gym/Both: +10 · No: +0 |
| **Exercise Frequency** | Never: +20 · 1–2×/wk: +10 · 3–5×/wk: +0 · Daily: **−10** *(protective)* |
| **Pain Level** | Chronic: **+35** · Frequently: +25 · Occasionally: +15 · Never: +0 |
| **Posture** | Slouching: +15 · Neutral: +0 · Conscious: **−5** *(protective)* |
| **Sleep Position** | Stomach: +10 · Side/Back/Varies: +0 |

> **Maximum raw score:** 20 + 5 + 25 + 15 + 20 + 35 + 15 + 10 = **145 → clamped to 100**

### 4-Tier Risk Categories

| Score | Tier | Colour | Recommended Action |
|-------|------|--------|--------------------|
| **0–30** | 🟢 Low | Green | Keep moving — maintenance exercises |
| **31–60** | 🟡 Moderate | Amber | Ergonomic adjustments + daily exercises |
| **61–85** | 🔴 High | Red | Consultation with a spine specialist |
| **86–100** | 🚨 Critical | Red (intense) | Immediate intervention needed |

### Educational Tooltips
Every quiz option shows an **ℹ️ button** that reveals a clinical reason explaining *why* that choice affects spine risk. These are defined in `OPTION_TOOLTIPS` within `riskEngine.ts`.

---

## 🏋️ Exercise Library

All 12 exercises are categorised by spinal region:

| Category | Exercises |
|----------|-----------|
| **All** | 1–12 |
| **Cervical** | 1, 2, 3, 8, 12 |
| **Lumbar** | 1, 2, 3, 12 |
| **Sacral** | 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12 |

### Exercise Reference

| # | Duration | Surface | Key Instruction |
|---|----------|---------|----------------|
| 1 | 2 min | Yoga mat (hands & knees) | Back bend 10s → straight 5s, repeat |
| 2 | 2 min | Yoga mat | Back bend 10s → straight 5s, repeat |
| 3 | 3 min | Yoga mat (hands & knees) | Dog pose: opposite arm+leg, 8s each side |
| 4 | 3 min | Yoga mat (face down) | Raise one leg 30°, 8s each, alternate |
| 5 | 3 min | Yoga mat (face up) | Knee to chest, one leg at a time, 8s each |
| 6 | 2 min | Yoga mat (face up) | Both knees to chest simultaneously |
| 7 | 2 min | Yoga mat (face up) | Waist rotation side stretch, 8s each side |
| 8 | ~2 min | Bed edge | Head hanging off edge — 3 sets × 25s |
| 9 | 3 min | Bed or mat | Leg at 90° hip & knee, one leg at a time, 8s |
| 10 | 3 min | Floor | Body stretch with knee fold, 8s each side |
| 11 | ~2 min | Bed or mat | Knee fold bridge (hip lift) — 4 sets × 20s |
| 12 | 10s once | Floor | Full body stretch — **age ≤ 25 only** |

### Points per Exercise

| Exercises | Points |
|-----------|--------|
| 1, 2, 7, 8, 10, 12 | **25 pts** |
| 6, 11 | **22 pts** |
| 3, 4, 5, 9 | **20 pts** |

---

## 🔄 Architecture & Data Flow

### Exercise Numbering
Exercises are fetched from Supabase ordered by `id`. Each exercise gets a `position` field (1–12) at fetch time, which is used for image (`sse1.png`…`sse12.png`) and metadata lookups — decoupled from the raw DB ID to prevent mismatches.

### Daily Routine Personalisation
| Risk Tier | Exercises/Day | Title |
|-----------|--------------|-------|
| Low | 3 | Spine Maintenance |
| Moderate | 4 | Posture Correction |
| High/Critical | 6 | Full Corrective Program |

Exercises rotate daily based on streak count.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion, Canvas Confetti |
| **3D Rendering** | React Three Fiber, Drei |
| **Backend / DB** | Supabase (Auth, PostgreSQL) |
| **State** | React Context API |
| **Routing** | React Router DOM v7 |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SpineModel3D        # Three.js 3D spine visualiser
│   ├── ConsultationFinder
│   ├── ProtectedRoute
│   └── PublicRoute
├── context/
│   ├── AuthContext         # Auth, user profiles, sessions — persists all 8 risk fields
│   └── AppContext          # Streaks, daily routines, facts, points
├── hooks/
│   └── useAllExercises     # Fetches exercises ordered by id, assigns position 1-12
├── layouts/
│   └── DashboardLayout
├── pages/
│   ├── Home                # Landing page with causes + reasons sections
│   ├── Auth                # Login / Signup with password eye toggle
│   ├── Onboarding          # Risk assessment quiz (8 questions + tooltips)
│   ├── Dashboard           # Daily hub
│   ├── RoutinePlayer       # Active exercise player
│   ├── ExerciseLibrary     # Library with Cervical / Lumbar / Sacral filters
│   ├── CustomPlans
│   ├── Leaderboard
│   ├── Profile             # Shows risk score, tier, primaryReason, badges
│   ├── AtRisk
│   └── Facts
├── types/
│   └── index.ts            # Exercise (with position), UserProfile (with gender, primaryReason)
└── utils/
    ├── riskEngine.ts       # calculateSpineRisk(), OPTION_TOOLTIPS, TIER_CONFIG
    ├── exerciseImages.ts   # Image map (position → sse*.png)
    ├── exerciseMeta.ts     # Timing & instructions for all 12 exercises
    └── exercisePoints.ts   # Points per exercise
```

---

## 🗄️ Supabase Database

### `user_profiles` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Supabase auth user ID |
| `full_name` | text | Display name |
| `onboarding_complete` | bool | Whether quiz is done |
| `spine_risk_score` | int | 0–100 calculated score |
| `risk_tier` | text | low / moderate / high / critical |
| `primary_reason` | text | Top risk factor explanation |
| `gender` | text | Quiz answer |
| `age_group` | text | Quiz answer |
| `occupation_type` | text | Quiz answer |
| `exercise_frequency` | text | Quiz answer |
| `pain_level` | text | Quiz answer |
| `posture_awareness` | text | Quiz answer |
| `sleep_position` | text | Quiz answer |

### Other tables
| Table | Purpose |
|-------|---------|
| `user_streaks` | Current streak, longest streak, total/weekly points |
| `exercises` | Exercise catalogue (name, target area, duration, category) |
| `spine_facts` | Daily rotating spine health facts |

---

## 🚀 Getting Started

```bash
git clone https://github.com/hikityofficial/spinekare.git
cd spinekare
npm install

# Set env vars
cp .env.example .env
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=

npm run dev
```

---

## 👥 Team

Built by [Hikity](https://hikity.xyz)

## 📜 License

Proprietary — All rights reserved.
