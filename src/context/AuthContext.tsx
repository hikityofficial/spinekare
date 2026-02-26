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
                        ageGroup: data.age_group,
                        occupationType: data.occupation_type,
                    };
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
                    setUser(prev => prev || ({
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
            await loadProfile(session?.user);
        });

        // Force absolute fallback to hide loading screen if Supabase completely hangs
        fallbackTimer = setTimeout(() => {
            if (mounted) {
                console.warn("Auth initialization timed out 15s, forcing load to false.");
                setIsLoading(false);
            }
        }, 15000);

        return () => {
            mounted = false;
            clearTimeout(fallbackTimer);
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password?: string) => {
        if (!password) {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/dashboard'
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
                    redirectTo: window.location.origin + '/dashboard'
                }
            });
            if (error) throw error;
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

        // Map to DB snake_case structure
        const dbData = {
            id: user.id,
            full_name: newProfile.fullName,
            onboarding_complete: newProfile.onboardingComplete,
            spine_risk_score: newProfile.spineRiskScore,
            risk_tier: newProfile.riskTier,
            age_group: newProfile.ageGroup,
            occupation_type: newProfile.occupationType,
        };

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
