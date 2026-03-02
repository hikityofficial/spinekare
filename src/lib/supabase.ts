import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Custom storage ignoring locking entirely to prevent 10s timeout loops
const customStorage = {
    getItem: (key: string) => {
        try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    setItem: (key: string, value: string) => {
        try { window.localStorage.setItem(key, value); } catch (e) { }
    },
    removeItem: (key: string) => {
        try { window.localStorage.removeItem(key); } catch (e) { }
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        lock: (name, acquire) => {
            // BYPASS Navigator LockManager entirely because it fails aggressively on mobile/vercel
            // Immediately execute the lock acquire function 
            return acquire();
        }
    }
});
