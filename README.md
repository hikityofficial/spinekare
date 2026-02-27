# 🦴 SpineKare

**Medical-grade posture care & spine wellness companion.**

SpineKare is a clinical spine-health application that provides personalised exercise routines, risk profiling, and gamified progress tracking — all designed to help users maintain a healthy spine through just 5 minutes of daily exercises.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Spine Risk Assessment** | 7-factor questionnaire that calculates a personalised risk score (0–100) |
| **Daily Routines** | Auto-generated exercise plans tailored to risk tier and streak progress |
| **3D Spine Visualiser** | Interactive Three.js model highlighting targeted spinal areas during exercises |
| **Exercise Library** | 12 guided exercises with images, form cues, surface requirements, and video demos |
| **Custom Plans** | Build your own exercise sequences from the full library |
| **Gamification** | Points system, daily streaks, weekly leaderboard, and achievement badges |
| **Spine Facts** | Daily rotating spine health facts from the database |
| **Consultation Finder** | Geolocation-based nearby spine clinic suggestions |
| **At-Risk Page** | Nearby hospital finder for high-risk users |

---

## 🧠 How Risk Detection Works

During onboarding, the user answers **7 lifestyle questions**. Each answer is assigned a weighted score, and the total determines their **Spine Risk Tier**.

### Questionnaire Factors

| # | Factor | Question |
|---|--------|----------|
| 1 | **Age Group** | How old are you? |
| 2 | **Occupation Type** | What best describes your daily occupation? |
| 3 | **Weightlifting** | Do you lift heavy weights? |
| 4 | **Exercise Frequency** | Do you exercise regularly? |
| 5 | **Pain Level** | Do you experience back or neck pain? |
| 6 | **Posture Awareness** | How is your posture awareness? |
| 7 | **Sleep Position** | What is your primary sleep position? |

### Scoring Algorithm

Each response adds (or subtracts) points to a cumulative risk score:

```
RISK SCORE CALCULATION
═══════════════════════════════════════════════

AGE GROUP                         POINTS
  Under 20 / 20–35               +0
  35–50                           +10
  50–65                           +15
  65+                             +20

OCCUPATION TYPE                   POINTS
  Desk job (8+ hrs sitting)       +25   ← Highest risk factor
  Driver                          +20
  Physical labor                  +15
  Standing/retail / Student       +0

WEIGHTLIFTING                     POINTS
  Construction                    +15
  Gym / Both                      +10
  No                              +0

EXERCISE FREQUENCY                POINTS
  Never                           +20
  1–2x week                       +10
  3–5x week                       +0
  Daily                           −10   ← Protective factor

PAIN LEVEL                        POINTS
  Chronic                         +35   ← Highest single factor
  Frequently                      +25
  Occasionally                    +15
  Never                           +0

POSTURE AWARENESS                 POINTS
  Slouch constantly               +15
  Sometimes                       +0
  Conscious of it                 −5    ← Protective factor

SLEEP POSITION                    POINTS
  Stomach                         +10
  Side / Back / Varies            +0

═══════════════════════════════════════════════
FINAL SCORE = clamp(sum, 0, 100)
```

### Risk Tiers

| Score Range | Tier | Colour | Meaning |
|-------------|------|--------|---------|
| **0 – 29** | 🟢 Low | Green | Great baseline — maintenance exercises |
| **30 – 59** | 🟡 Moderate | Amber | Warning signs — developing compression habits |
| **60 – 100** | 🔴 High | Red | Urgent daily attention — severe spinal stress |

### Worst-Case Scenario

A user who is **65+**, has a **desk job**, does **construction lifting**, **never exercises**, has **chronic pain**, **slouches constantly**, and sleeps on their **stomach** would score:

```
20 + 25 + 15 + 20 + 35 + 15 + 10 = 140 → clamped to 100 (HIGH RISK)
```

### Best-Case Scenario

A user **under 20**, who is a **student**, **doesn't lift**, **exercises daily**, has **no pain**, is **posture-conscious**, and sleeps on their **back**:

```
0 + 0 + 0 + (−10) + 0 + (−5) + 0 = −15 → clamped to 0 (LOW RISK)
```

---

## 🏋️ Points System

Each exercise awards points based on difficulty:

| Exercises | Points |
|-----------|--------|
| 1, 2, 7, 8, 10, 12 | **25 pts** each |
| 6, 11 | **22 pts** each |
| 3, 4, 5, 9 | **20 pts** each |

**Leaderboard bonuses** (awarded weekly to top 3):
- 🥇 1st place: **+100 pts**
- 🥈 2nd place: **+75 pts**
- 🥉 3rd place: **+50 pts**

---

## 🔄 Daily Routine Logic

Routines are **personalised** based on two factors:

1. **Risk Tier** → Determines exercise intensity and target areas
2. **Current Streak** → Unlocks progressive difficulty levels

The system rotates through different exercise combinations daily, ensuring variety while targeting the user's specific risk areas.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion, Canvas Confetti |
| **3D Rendering** | React Three Fiber, Drei |
| **Backend** | Supabase (Auth, PostgreSQL, Realtime) |
| **State** | React Context API |
| **Routing** | React Router DOM v7 |

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── SpineModel3D   # Three.js 3D spine visualiser
│   ├── ConsultationFinder
│   ├── ProtectedRoute
│   └── PublicRoute
├── context/           # Global state management
│   ├── AuthContext    # Auth, user profiles, sessions
│   └── AppContext     # Streaks, routines, facts, points
├── hooks/             # Custom React hooks
│   └── useAllExercises
├── layouts/           # Page layout wrappers
│   └── DashboardLayout
├── lib/               # Third-party clients
│   └── supabase.ts
├── pages/             # Route-level page components
│   ├── Home           # Landing page (public)
│   ├── Auth           # Login / Signup
│   ├── Onboarding     # Risk assessment questionnaire
│   ├── Dashboard      # Daily hub
│   ├── RoutinePlayer  # Active exercise player
│   ├── ExerciseLibrary
│   ├── CustomPlans
│   ├── Leaderboard
│   ├── Profile
│   ├── AtRisk
│   └── Facts
├── types/             # TypeScript interfaces
└── utils/             # Helper functions
    ├── exerciseImages
    ├── exerciseMeta
    └── exercisePoints
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project (for auth & database)

### Installation

```bash
# Clone the repo
git clone https://github.com/hikityofficial/spinekare.git
cd spinekare

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your Supabase URL and anon key:
#   VITE_SUPABASE_URL=your_supabase_url
#   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start dev server
npm run dev
```

### Build

```bash
npm run build
```

---

## 📊 Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `user_profiles` | Stores risk score, tier, onboarding answers, name |
| `user_streaks` | Current streak, longest streak, total/weekly points |
| `exercises` | Exercise catalogue (name, duration, target area, category) |
| `spine_facts` | Daily rotating spine health facts |

---

## 👥 Team

Built by [Hikity](https://hikity.xyz)

---

## 📜 License

This project is proprietary. All rights reserved.
