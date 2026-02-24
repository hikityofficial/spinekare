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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    const [streak, setStreak] = useState<UserStreak>({
        userId: '',
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: '',
        streakFreezes: 0,
        totalPoints: 0
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

                // Deterministically select exercises cycling based on the current streak day
                // This ensures variety each day while following the tier volume limits
                for (let i = 0; i < count; i++) {
                    const index = (currentDay + i) % allExercises.length;
                    selectedExercises.push(allExercises[index]);
                }

                const estimatedMins = Math.ceil(
                    selectedExercises.reduce((acc, ex) => acc + ex.durationSeconds + 15, 0) / 60
                );

                setTodayRoutine({
                    id: currentDay, // Fake ID based on day
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

        // If we don't have the user/streak loaded yet, Wait.
        if (streak.userId !== '') {
            fetchDailyContent();
        }
    }, [user?.riskTier, streak.currentStreak, streak.userId]);

    // Load initial streak data
    useEffect(() => {
        if (!user) return;

        // LocalStorage fallback sync for mock mode - REMOVED

        // Fetch from Supabase
        const fetchStreak = async () => {
            const { data, error } = await supabase
                .from('user_streaks')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setStreak({
                    userId: data.user_id,
                    currentStreak: data.current_streak,
                    longestStreak: data.longest_streak,
                    totalPoints: data.total_points,
                    lastActivityDate: data.last_completed_date ? data.last_completed_date.split('T')[0] : '',
                    streakFreezes: 0
                });
            } else if (error && error.code === 'PGRST116') {
                // Initialize default in DB
                await supabase.from('user_streaks').insert({ user_id: user.id });
                setStreak({
                    userId: user.id,
                    currentStreak: 0,
                    longestStreak: 0,
                    totalPoints: 0,
                    lastActivityDate: '',
                    streakFreezes: 0
                });
            }
        };

        fetchStreak();
    }, [user]);

    // LocalStorage fallback sync for mock mode - REMOVED

    const completeRoutine = async () => {
        if (hasCompletedToday || !user) return;

        // Optimistic UI update
        let newStreakObj: UserStreak | null = null;

        setStreak((prev) => {
            const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            let newStreak = prev.currentStreak;

            if (prev.lastActivityDate === yesterdayStr) {
                newStreak += 1; // Continued streak
            } else {
                newStreak = 1; // Restart streak
            }

            const updated = {
                ...prev,
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
                lastActivityDate: todayStr,
                totalPoints: prev.totalPoints + 100
            };
            newStreakObj = updated;
            return updated;
        });

        if (newStreakObj) {
            const s = newStreakObj as UserStreak;
            await supabase.from('user_streaks').upsert({
                user_id: user.id,
                current_streak: s.currentStreak,
                longest_streak: s.longestStreak,
                total_points: s.totalPoints,
                last_completed_date: new Date().toISOString()
            });
        }
    };

    const addPoints = async (points: number) => {
        if (!user) return;

        let newStreakObj: UserStreak | null = null;
        setStreak((prev) => {
            const updated = {
                ...prev,
                totalPoints: prev.totalPoints + points
            };
            newStreakObj = updated;
            return updated;
        });

        if (newStreakObj) {
            const s = newStreakObj as UserStreak;
            await supabase.from('user_streaks').upsert({
                user_id: user.id,
                current_streak: s.currentStreak,
                longest_streak: s.longestStreak,
                total_points: s.totalPoints,
                last_completed_date: s.lastActivityDate ? new Date(s.lastActivityDate).toISOString() : null
            });
        }
    };

    return (
        <AppContext.Provider value={{ streak, todayRoutine, todayFact, completeRoutine, addPoints, hasCompletedToday }}>
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
