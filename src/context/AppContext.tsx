import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserStreak, Routine, SpineFact } from '../types';
import { mockRoutines, mockSpineFacts } from '../services/mockData';
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

    const dayOfYear = getDayOfYear();

    // Modulo calculation to cycle routines and facts
    const routineIndex = dayOfYear % mockRoutines.length;
    const todayRoutine = mockRoutines[routineIndex];

    const factIndex = dayOfYear % mockSpineFacts.length;
    const todayFact = mockSpineFacts[factIndex];

    const todayStr = new Date().toISOString().split('T')[0];
    const hasCompletedToday = streak.lastActivityDate === todayStr;

    // Load initial streak data
    useEffect(() => {
        if (!user) return;

        if (user.id.includes('mock')) {
            const saved = localStorage.getItem('spincare_streak');
            if (saved) {
                setStreak(JSON.parse(saved));
            } else {
                setStreak({
                    userId: user.id,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastActivityDate: '',
                    streakFreezes: 0,
                    totalPoints: 0
                });
            }
            return;
        }

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

    // LocalStorage fallback sync for mock mode
    useEffect(() => {
        if (user && user.id.includes('mock')) {
            localStorage.setItem('spincare_streak', JSON.stringify(streak));
        }
    }, [streak, user]);

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

        if (newStreakObj && !user.id.includes('mock')) {
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

        if (newStreakObj && !user.id.includes('mock')) {
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
