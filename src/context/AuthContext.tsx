import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password?: string) => Promise<void>;
    signup: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(`[AUTH DEBUG] isLoading state changed to: ${isLoading}`);
    }, [isLoading]);

    useEffect(() => {
        let mounted = true;
        let bypassSuccessful = false;
        let fallbackTimer: ReturnType<typeof setTimeout>;
        let fetchingUserId: string | null = null;

        const loadProfile = async (sessionUser: any) => {
            if (!sessionUser) {
                if (mounted) {
                    setUser(null);
                    setIsLoading(false);
                    clearTimeout(fallbackTimer);
                }
                return;
            }

            if (fetchingUserId === sessionUser.id) return;
            fetchingUserId = sessionUser.id;

            let cachedProfile: UserProfile | null = null;
            try {
                const cached = localStorage.getItem(`spinekare-profile-${sessionUser.id}`);
                if (cached) cachedProfile = JSON.parse(cached);
            } catch (e) { }

            // Pre-load cached profile instantly to prevent dashboard flicker
            if (cachedProfile && mounted) {
                setUser(cachedProfile);
                setIsLoading(false);
                clearTimeout(fallbackTimer);
            }

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', sessionUser.id)
                    .single();

                let profile: UserProfile;

                if (data) {
                    profile = {
                        id: data.id,
                        fullName: data.full_name || sessionUser.email?.split('@')[0] || 'User',
                        onboardingComplete: data.onboarding_complete,
                        spineRiskScore: data.spine_risk_score,
                        riskTier: data.risk_tier as any,
                        primaryReason: data.primary_reason,
                        gender: data.gender,
                        ageGroup: data.age_group,
                        occupationType: data.occupation_type,
                        isWeightlifter: data.is_weightlifter,
                        exerciseFrequency: data.exercise_frequency,
                        painLevel: data.pain_level,
                        postureAwareness: data.posture_awareness,
                        sleepPosition: data.sleep_position,
                    };
                    try {
                        localStorage.setItem(`spinekare-profile-${sessionUser.id}`, JSON.stringify(profile));
                    } catch (e) { }
                } else {
                    profile = {
                        id: sessionUser.id,
                        fullName: sessionUser.email?.split('@')[0] || 'User',
                        onboardingComplete: false,
                    };

                    if (error && error.code === 'PGRST116') {
                        // Create profile silently
                        console.log("Profile not found (406), attempting to upsert a default profile...");
                        const { error: upsertError } = await supabase.from('user_profiles').upsert({
                            id: sessionUser.id,
                            full_name: profile.fullName,
                            onboarding_complete: false
                        });
                        if (upsertError) {
                            console.error("Critical: Failed to upsert profile during session init:", upsertError);
                        } else {
                            console.log("Successfully implicitly created user profile");
                        }
                    } else if (error) {
                        console.error("Unknown DB error while fetching profile:", error);
                        // CRITICAL FIX: If DB failed (e.g., ISP blocked), DO NOT OVERWRITE with dummy profile if we have cache
                        if (cachedProfile) {
                            console.log("Restoring cached profile due to DB error.");
                            profile = cachedProfile;
                        }
                    }
                }

                if (mounted) {
                    console.log("loadProfile finished successfully. Unsetting isLoading.");
                    setUser(profile);
                    setIsLoading(false);
                    clearTimeout(fallbackTimer);
                }
            } catch (err) {
                console.error('Error executing profile fetch:', err);
                if (mounted) {
                    setUser(prev => prev || cachedProfile || ({
                        id: sessionUser.id,
                        fullName: sessionUser.email?.split('@')[0] || 'User',
                        onboardingComplete: false,
                    } as UserProfile));
                    setIsLoading(false);
                    clearTimeout(fallbackTimer);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                    clearTimeout(fallbackTimer);
                }
                fetchingUserId = null;
            }
        };

        const initAuth = async () => {
            try {
                // 1. Instant LocalStorage check to bypass LockManager hangs 
                const rawStorageStr = localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');

                if (rawStorageStr) {
                    try {
                        const parsed = JSON.parse(rawStorageStr);
                        if (parsed && parsed.user) {
                            // We have a stored user! Skip waiting for the lock and load profile immediately
                            bypassSuccessful = true;
                            await loadProfile(parsed.user);

                            // Inform the strict UI loader that we are done booting
                            if (mounted) {
                                setIsLoading(false);
                                clearTimeout(fallbackTimer);
                            }

                            // Still call getSession in background to let Supabase refresh tokens if needed
                            supabase.auth.getSession().catch(e => console.warn("Background session sync:", e.message));
                            return;
                        }
                    } catch (e) {
                        // ignore parse errors
                    }
                }

                // 2. Fallback to standard Supabase getSession if nothing in localStorage
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("getSession error:", error);
                    throw error;
                }
                await loadProfile(session?.user);

            } catch (error: any) {
                console.error("Error getting session:", error);
                if (error?.message?.includes('LockManager') || error?.message?.includes('timed out')) {
                    console.warn("Supabase lock is stuck. Waiting for onAuthStateChange to recover...");
                    // Do not set isLoading to false here, otherwise they get booted!
                } else {
                    if (mounted) {
                        setIsLoading(false);
                        clearTimeout(fallbackTimer);
                    }
                }
            }
        };

        // Delay slightly to ensure OAuth hashes are parsed by Supabase JS client
        setTimeout(initAuth, 100);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase Auth Event:", event, session?.user?.email);
            if (event === 'INITIAL_SESSION' && !session && bypassSuccessful) {
                console.log("Ignoring null INITIAL_SESSION because cache bypass was successful.");
                return;
            }
            if (event === 'SIGNED_OUT') {
                bypassSuccessful = false;
            }
            await loadProfile(session?.user);
        });

        // Force absolute fallback to hide loading screen if Supabase completely hangs
        fallbackTimer = setTimeout(() => {
            if (mounted) {
                console.warn("Auth initialization timed out 45s, forcing load to false.");
                setIsLoading(false);
            }
        }, 45000);

        return () => {
            mounted = false;
            clearTimeout(fallbackTimer);
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password?: string) => {
        if (!password) {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard',
                    skipBrowserRedirect: true
                }
            });
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signup = async (email: string, password?: string) => {
        if (!password) {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard',
                    skipBrowserRedirect: true
                }
            });
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
            return;
        }

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;

        // Optimistic update
        const newProfile = { ...user, ...data };
        setUser(newProfile);

        try {
            localStorage.setItem(`spinekare-profile-${user.id}`, JSON.stringify(newProfile));
        } catch (e) { }

        // Map to DB snake_case structure
        const dbData: Record<string, unknown> = {
            id: user.id,
            full_name: newProfile.fullName,
            onboarding_complete: newProfile.onboardingComplete,
            spine_risk_score: newProfile.spineRiskScore,
            risk_tier: newProfile.riskTier,
            primary_reason: newProfile.primaryReason,
            gender: newProfile.gender,
            age_group: newProfile.ageGroup,
            occupation_type: newProfile.occupationType,
            is_weightlifter: newProfile.isWeightlifter,
            exercise_frequency: newProfile.exerciseFrequency,
            pain_level: newProfile.painLevel,
            posture_awareness: newProfile.postureAwareness,
            sleep_position: newProfile.sleepPosition,
        };
        // Strip undefined values so we don't overwrite existing DB data with nulls
        Object.keys(dbData).forEach(k => dbData[k] === undefined && delete dbData[k]);


        const { error } = await supabase.from('user_profiles').upsert(dbData);
        if (error) {
            console.error('Error updating profile:', error);
            // Revert on error could be implemented here
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
