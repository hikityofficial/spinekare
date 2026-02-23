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

    // Helper to fetch or initialize profile
    const fetchOrInitProfile = async (authId: string, email?: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authId)
                .single();

            if (data) {
                // Return mapped data (handle snake_case to camelCase mapping here if needed, but our type UserProfile expects camelCase properties)
                // Let's assume the DB returns snake case and we map it:
                const mappedProfile: UserProfile = {
                    id: data.id,
                    fullName: data.full_name || email?.split('@')[0] || 'User',
                    onboardingComplete: data.onboarding_complete,
                    spineRiskScore: data.spine_risk_score,
                    riskTier: data.risk_tier as any,
                    ageGroup: data.age_group,
                    occupationType: data.occupation_type,
                };
                setUser(mappedProfile);
            } else if (error && error.code === 'PGRST116') {
                // No rows returned
                const newProfile: UserProfile = {
                    id: authId,
                    fullName: email?.split('@')[0] || 'User',
                    onboardingComplete: false,
                };
                setUser(newProfile);

                // We won't insert immediately until onboarding is complete to avoid partial saves,
                // actually we can insert immediately so RLS works.
                await supabase.from('user_profiles').insert({
                    id: authId,
                    full_name: newProfile.fullName,
                    onboarding_complete: false
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchOrInitProfile(session.user.id, session.user.email);
            } else {
                setIsLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await fetchOrInitProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password?: string) => {
        if (!password) {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
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
