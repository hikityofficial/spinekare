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
            // Calculate 1-30 for routine and 1-100 for facts
            const rDay = (dayOfYear % 30) + 1;
            const fDay = (dayOfYear % 100) + 1;

            const [routineRes, factRes] = await Promise.all([
                supabase
                    .from('routines')
                    .select('*, routine_exercises(order_index, exercises(*))')
                    .eq('day_number', rDay)
                    .single(),
                supabase
                    .from('spine_facts')
                    .select('*')
                    .eq('day_number', fDay)
                    .single()
            ]);

            if (routineRes.data) {
                const exMap = routineRes.data.routine_exercises
                    .sort((a: any, b: any) => a.order_index - b.order_index)
                    .map((re: any) => ({
                        id: re.exercises.id,
                        name: re.exercises.name,
                        description: re.exercises.description,
                        targetArea: re.exercises.target_area,
                        category: re.exercises.category,
                        durationSeconds: re.exercises.duration_seconds,
                        reps: re.exercises.reps,
                        whatItDoes: re.exercises.what_it_does,
                        difficulty: re.exercises.difficulty
                    }));

                setTodayRoutine({
                    id: routineRes.data.id,
                    dayNumber: routineRes.data.day_number,
                    title: routineRes.data.title,
                    focusArea: routineRes.data.focus_area,
                    estimatedMinutes: routineRes.data.estimated_minutes,
                    exercises: exMap
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

        fetchDailyContent();
    }, []);

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
