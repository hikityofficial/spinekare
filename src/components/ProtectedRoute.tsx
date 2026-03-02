import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4 text-center p-6">
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-bg-secondary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-text-secondary font-bold text-sm tracking-widest uppercase animate-pulse">Loading SpineKare...</p>

                {/* DIagnostic Block */}
                <div className="mt-8 p-4 bg-bg-card border border-accent-amber/50 rounded-radius text-left max-w-sm w-full text-xs text-text-secondary space-y-1 font-mono">
                    <h3 className="text-accent-amber font-bold mb-2 uppercase">Auth Debug Info</h3>
                    <p>User: {user ? user.fullName : 'null'}</p>
                    <p>IsAuth: {isAuthenticated ? 'true' : 'false'}</p>
                    <p>IsLoading: {isLoading ? 'true' : 'false'}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-3 py-1 bg-bg-secondary border border-border rounded w-full hover:bg-border/50">Force App Reload</button>
                    <button onClick={async () => {
                        const { supabase } = await import('../lib/supabase');
                        await supabase.auth.signOut();
                        window.location.href = '/auth';
                    }} className="mt-2 px-3 py-1 text-accent-red underline border border-transparent rounded w-full hover:bg-accent-red/10">Force Clear Data & Sign Out</button>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If user is authenticated but hasn't completed onboarding, force them to onboarding
    if (user && !user.onboardingComplete && window.location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
};

export const PublicRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4 text-center p-6">
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-bg-secondary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-text-secondary font-bold text-sm tracking-widest uppercase animate-pulse">Loading SpineKare...</p>
                <div className="mt-8 p-4 bg-bg-card border border-accent-amber/50 rounded-radius text-left max-w-sm w-full text-xs text-text-secondary space-y-1 font-mono">
                    <h3 className="text-accent-amber font-bold mb-2 uppercase">Auth Debug Info</h3>
                    <p>User: {user ? user.fullName : 'null'}</p>
                    <p>IsAuth: {isAuthenticated ? 'true' : 'false'}</p>
                    <p>IsLoading: {isLoading ? 'true' : 'false'}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-3 py-1 bg-bg-secondary border border-border rounded w-full hover:bg-border/50">Force App Reload</button>
                    <button onClick={async () => {
                        const { supabase } = await import('../lib/supabase');
                        await supabase.auth.signOut();
                        window.location.href = '/auth';
                    }} className="mt-2 px-3 py-1 text-accent-red underline border border-transparent rounded w-full hover:bg-accent-red/10">Force Clear Data & Sign Out</button>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        if (user && !user.onboardingComplete) {
            return <Navigate to="/onboarding" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
