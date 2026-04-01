# 🦴 SpineKare — To-Do List

> Last updated: 27 Feb 2026

---
hi jk
## ✅ Completed

- [x] Risk engine v2 — 8-factor weighted scoring (0–100), 4-tier categories
- [x] Gender question added to onboarding quiz
- [x] Educational ℹ️ tooltips on every quiz option
- [x] `primaryReason` generated and displayed on result screen & profile
- [x] Exercise position system — decoupled from DB ID, prevents image mismatches
- [x] All 12 exercises in library with correct images (sse1–sse12)
- [x] Exercise category filters — Cervical / Lumbar / Sacral correctly mapped
- [x] `exerciseMeta.ts` — single source of truth (name, targetArea, duration, sets, instructions, form cues)
- [x] RoutinePlayer uses `exerciseMeta` for heading, target label, instructions, surface, form cues
- [x] `getTotalPoints()` fixed to use `ex.position` not `ex.id`
- [x] `AuthContext` persists & loads all 8 risk fields to Supabase
- [x] Profile page shows tier label, score, and Primary Risk Factor card
- [x] Sign-out redirects to home page (`/`)
- [x] Logo click on Auth page redirects to home
- [x] Favicon changed to SpineKare logo
- [x] README fully updated

---

## 🔧 In Progress / Needs Attention

- [ ] **Precautions section** — 5 clickable image placeholders need real precaution photos uploaded
- [ ] **Home page Reasons section** — 4 image placeholders need real spine issue reason photos uploaded
- [ ] **Videos tab** — only 2 placeholder videos, needs proper exercise video content

---

## 🚀 Features To Build

### High Priority
- [ ] **Re-assessment** — allow users to retake the quiz and update their risk score
- [ ] **Push notifications** — daily reminder to complete exercise routine
- [ ] **Streak freeze logic** — implement the `streakFreezes` field properly
- [ ] **Navigation from At-Risk page** — direct link to book consultation

### Medium Priority
- [ ] **Exercise completion tracking** — log which exercises were done per day in Supabase
- [ ] **Leaderboard weekly reset** — verify Monday reset logic matches `user_streaks.week_number`
- [ ] **Custom Plans persistence** — currently saves to `localStorage`, migrate to Supabase
- [ ] **Profile edit** — allow changing display name and re-running onboarding
- [ ] **Badges implementation** — "Posture Pro", "Knowledge Keeper", "Risk Reducer" are currently unearnable

### Low Priority
- [ ] **Dark/light mode toggle**
- [ ] **Onboarding animation polish** — entry animation on first screen
- [ ] **Code splitting** — reduce JS bundle size (currently warns >500 kB chunk)
- [ ] **Offline support / PWA** — cache exercises for offline use

---

## 🐛 Known Issues

- [ ] Large JS bundle warning (`dist/assets/index.js` > 1.5 MB) — needs dynamic `import()`
- [ ] `exerciseMeta` `durationSeconds` not synced to Supabase `exercises.duration_seconds` — timer uses DB value, badge uses meta value
- [ ] Dashboard routine exercises come from AppContext which selects by array index — if DB has fewer than 12 exercises, routine breaks

---

## 🗄️ Supabase Tasks

- [ ] Add columns to `user_profiles` table: `gender`, `exercise_frequency`, `pain_level`, `posture_awareness`, `sleep_position`, `primary_reason` (if not already created via migrations)
- [ ] Seed `exercises` table with all 12 exercises in correct order (id 1–12) with matching names
- [ ] Seed `spine_facts` table with at least 5 facts (day_number 1–5)
- [ ] Set up Row Level Security (RLS) policies for `user_profiles` and `user_streaks`

---

## 📱 Content To Upload

| Section | Files Needed |
|---------|-------------|
| Precautions (Library) | 5 precaution images (spine injury photos) |
| Reasons (Home page) | 4 spine issue cause images |
| Videos (Library) | Exercise demonstration videos for all 12 exercises |
| Exercise images | Verify `sse1.png`–`sse12.png` match each exercise correctly |
