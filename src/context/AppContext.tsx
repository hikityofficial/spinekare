import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserStreak, Routine, SpineFact } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface AppContextType {
    streak: UserStreak;
    todayRoutine: Routine;
    todayFact: SpineFact;
    completeRoutine: () => void;
    addPoints: (points: number) => void;
    hasCompletedToday: boolean;
    weekResetDate: Date; // Next Monday midnight (UTC)
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

/** Returns the ISO week number (1–53) for a given date */
function getISOWeek(date: Date): { week: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number (Mon=1)
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { week, year: d.getUTCFullYear() };
}

/** Returns the next Monday at 00:00 UTC */
function getNextMonday(): Date {
    const now = new Date();
    const day = now.getUTCDay(); // 0=Sun, 1=Mon, …
    const daysUntilMonday = day === 0 ? 1 : 8 - day; // if Sun, next day; else next Mon
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilMonday));
    return next;
}

/** Bonus points for top-3 weekly finishers */
const WEEKLY_BONUS = [100, 75, 50]; // rank 1, 2, 3

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    const [streak, setStreak] = useState<UserStreak>({
        userId: '',
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: '',
        streakFreezes: 0,
        totalPoints: 0,
        weeklyPoints: 0,
        weekNumber: 0,
        weekYear: 0,
    });

    const [todayRoutine, setTodayRoutine] = useState<Routine>({
        id: 0,
        dayNumber: 0,
        title: 'Loading Routine...',
        focusArea: '',
        estimatedMinutes: 0,
        exercises: []
    });

    const [todayFact, setTodayFact] = useState<SpineFact>({
        id: 0,
        fact: 'Loading spine fact...',
        category: '',
        dayNumber: 0
    });

    const dayOfYear = getDayOfYear();
    const todayStr = new Date().toISOString().split('T')[0];
    const hasCompletedToday = streak.lastActivityDate === todayStr;
    const weekResetDate = getNextMonday();

    useEffect(() => {
        const fetchDailyContent = async () => {
            const fDay = (dayOfYear % 5) + 1;

            const [exercisesRes, factRes] = await Promise.all([
                supabase.from('exercises').select('*').order('id'),
                supabase.from('spine_facts').select('*').eq('day_number', fDay).single()
            ]);

            if (exercisesRes.data) {
                const allExercises = exercisesRes.data.map((ex: any) => ({
                    id: ex.id,
                    name: ex.name,
                    description: ex.description,
                    targetArea: ex.target_area,
                    category: ex.category,
                    durationSeconds: ex.duration_seconds,
                    reps: ex.reps,
                    whatItDoes: ex.what_it_does,
                    difficulty: ex.difficulty
                }));

                // Personalize Daily Routine based on Risk Tier & Streak Day
                const tier = user?.riskTier || 'moderate';
                const currentDay = streak.currentStreak + 1;

                let selectedExercises: any[] = [];
                let title = "Daily Assignment";
                let count = 4;

                if (tier === 'low') {
                    count = 3;
                    title = `Day ${currentDay} — Spine Maintenance`;
                } else if (tier === 'moderate') {
                    count = 4;
                    title = `Day ${currentDay} — Posture Correction`;
                } else {
                    count = 6;
                    title = `Day ${currentDay} — Full Corrective Program`;
                }

                for (let i = 0; i < count; i++) {
                    const index = (currentDay + i) % allExercises.length;
                    selectedExercises.push(allExercises[index]);
                }

                const estimatedMins = Math.ceil(
                    selectedExercises.reduce((acc, ex) => acc + ex.durationSeconds + 15, 0) / 60
                );

                setTodayRoutine({
                    id: currentDay,
                    dayNumber: currentDay,
                    title: title,
                    focusArea: tier === 'low' ? 'Maintenance' : 'Correction',
                    estimatedMinutes: estimatedMins,
                    exercises: selectedExercises
                });
            }

            if (factRes.data) {
                setTodayFact({
                    id: factRes.data.id,
                    fact: factRes.data.fact,
                    category: factRes.data.category,
                    dayNumber: factRes.data.day_number
                });
            }
        };

        if (streak.userId !== '') {
            fetchDailyContent();
        }
    }, [user?.riskTier, streak.currentStreak, streak.userId]);

    // Load initial streak data & handle weekly reset + bonus
    useEffect(() => {
        if (!user) return;

        const fetchStreak = async () => {
            const { data, error } = await supabase
                .from('user_streaks')
                .select('*')
                .eq('user_id', user.id)
                .single();

            const { week: currentWeek, year: currentYear } = getISOWeek(new Date());

            if (data) {
                const storedWeek: number = data.week_number ?? 0;
                const storedYear: number = data.week_year ?? 0;
                const isNewWeek = storedWeek !== currentWeek || storedYear !== currentYear;

                let bonusToAward = 0;

                if (isNewWeek && data.weekly_points > 0) {
                    // Check if they were in top 3 last week using the snapshot kept on total_points rank
                    // We fetch the top-3 weekly_points from last week to determine rank
                    const { data: topData } = await supabase
                        .from('user_streaks')
                        .select('user_id, weekly_points')
                        .eq('week_number', storedWeek)
                        .eq('week_year', storedYear)
                        .order('weekly_points', { ascending: false })
                        .limit(3);

                    if (topData) {
                        const rank = topData.findIndex((r: any) => r.user_id === user.id);
                        if (rank >= 0 && rank < 3) {
                            bonusToAward = WEEKLY_BONUS[rank];
                        }
                    }
                }

                const newTotalPoints = data.total_points + bonusToAward;
                const newWeeklyPoints = isNewWeek ? 0 : (data.weekly_points ?? 0);

                const streakObj: UserStreak = {
                    userId: data.user_id,
                    currentStreak: data.current_streak,
                    longestStreak: data.longest_streak,
                    totalPoints: newTotalPoints,
                    lastActivityDate: data.last_completed_date ? data.last_completed_date.split('T')[0] : '',
                    streakFreezes: 0,
                    weeklyPoints: newWeeklyPoints,
                    weekNumber: currentWeek,
                    weekYear: currentYear,
                };
                setStreak(streakObj);

                // Persist the reset / bonus to DB
                if (isNewWeek || bonusToAward > 0) {
                    await supabase.from('user_streaks').upsert({
                        user_id: user.id,
                        current_streak: data.current_streak,
                        longest_streak: data.longest_streak,
                        total_points: newTotalPoints,
                        weekly_points: 0,
                        week_number: currentWeek,
                        week_year: currentYear,
                        last_completed_date: data.last_completed_date ?? null,
                    });
                }
            } else if (error && error.code === 'PGRST116') {
                // Initialize default in DB
                await supabase.from('user_streaks').insert({
                    user_id: user.id,
                    week_number: currentWeek,
                    week_year: currentYear,
                    weekly_points: 0,
                });
                setStreak({
                    userId: user.id,
                    currentStreak: 0,
                    longestStreak: 0,
                    totalPoints: 0,
                    lastActivityDate: '',
                    streakFreezes: 0,
                    weeklyPoints: 0,
                    weekNumber: currentWeek,
                    weekYear: currentYear,
                });
            }
        };

        fetchStreak();
    }, [user]);

    const completeRoutine = async () => {
        if (hasCompletedToday || !user) return;

        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newStreak = streak.currentStreak;

        if (streak.lastActivityDate === yesterdayStr) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }

        const updated: UserStreak = {
            ...streak,
            currentStreak: newStreak,
            longestStreak: Math.max(streak.longestStreak, newStreak),
            lastActivityDate: todayStr,
            totalPoints: streak.totalPoints + 100,
            weeklyPoints: streak.weeklyPoints + 100,
        };

        setStreak(updated);

        await supabase.from('user_streaks').upsert({
            user_id: user.id,
            current_streak: updated.currentStreak,
            longest_streak: updated.longestStreak,
            total_points: updated.totalPoints,
            weekly_points: updated.weeklyPoints,
            week_number: updated.weekNumber,
            week_year: updated.weekYear,
            last_completed_date: new Date().toISOString()
        });
    };

    const addPoints = async (points: number) => {
        if (!user) return;

        const updated: UserStreak = {
            ...streak,
            totalPoints: streak.totalPoints + points,
            weeklyPoints: streak.weeklyPoints + points,
        };

        setStreak(updated);

        await supabase.from('user_streaks').upsert({
            user_id: user.id,
            current_streak: updated.currentStreak,
            longest_streak: updated.longestStreak,
            total_points: updated.totalPoints,
            weekly_points: updated.weeklyPoints,
            week_number: updated.weekNumber,
            week_year: updated.weekYear,
            last_completed_date: updated.lastActivityDate ? new Date(updated.lastActivityDate).toISOString() : null
        });
    };

    return (
        <AppContext.Provider value={{ streak, todayRoutine, todayFact, completeRoutine, addPoints, hasCompletedToday, weekResetDate }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
