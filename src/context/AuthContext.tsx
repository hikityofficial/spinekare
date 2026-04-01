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
        let mounted = true;

        const loadProfile = async (sessionUser: any) => {
            if (!sessionUser) {
                if (mounted) {
                    setUser(null);
                    setIsLoading(false);
                }
                return;
            }

            try {
                // Read cache first for instant feedback
                let cachedProfile = null;
                try {
                    const cached = localStorage.getItem(`spinekare-profile-${sessionUser.id}`);
                    if (cached) {
                        cachedProfile = JSON.parse(cached);
                        if (mounted) {
                            setUser(cachedProfile);
                            setIsLoading(false); // Enable instant UI!
                        }
                    }
                } catch (e) { }

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
                        // Upsert minimal profile
                        await supabase.from('user_profiles').upsert({
                            id: sessionUser.id,
                            full_name: profile.fullName,
                            onboarding_complete: false
                        });
                    } else if (error && cachedProfile) {
                        profile = cachedProfile; // DB failed, rely on cache
                    }
                }

                if (mounted) {
                    setUser(profile);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error in loadProfile:', err);
                if (mounted) setIsLoading(false);
            }
        };

        const initializeAuth = async () => {
            // Delay disabling loading state if we suspect an OAuth callback is processing
            const hash = window.location.hash;
            const search = window.location.search;
            const isAuthCallback = hash.includes('access_token') || search.includes('code=');
            
            if (isAuthCallback) {
                console.log("OAuth callback detected in URL. Allowing onAuthStateChange to handle user load.");
                return;
            }

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                await loadProfile(session?.user);
            } catch (err) {
                console.error('Session get error:', err);
                if (mounted) setIsLoading(false);
            }
        };

        // Added small timeout to let Supabase SDK digest URL params before fetching session 
        setTimeout(initializeAuth, 50);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase Auth Event:", event, session?.user?.email);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                 if (session) await loadProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                 if (mounted) {
                     setUser(null);
                     setIsLoading(false);
                 }
            }
        });

        const failSafeTimer = setTimeout(() => {
            if (mounted && isLoading) {
                console.warn("Auth init max timeout. Forcing UI to load.");
                setIsLoading(false);
            }
        }, 12000);

        return () => {
            mounted = false;
            clearTimeout(failSafeTimer);
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password?: string) => {
        if (!password) {
            // FIX: Remove skipBrowserRedirect to fix Google Auth popup blocking and PWA issues
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard',
                }
            });
            if (error) throw error;
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signup = async (email: string, password?: string) => {
        if (!password) {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard',
                }
            });
            if (error) throw error;
            return;
        }

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const logout = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        setIsLoading(false);
        if (error) throw error;
        setUser(null);
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        const newProfile = { ...user, ...data };
        setUser(newProfile);
        try {
            localStorage.setItem(`spinekare-profile-${user.id}`, JSON.stringify(newProfile));
        } catch (e) { }

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
        Object.keys(dbData).forEach(k => dbData[k] === undefined && delete dbData[k]);

        await supabase.from('user_profiles').upsert(dbData);
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
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
