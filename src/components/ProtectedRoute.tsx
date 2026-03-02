import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-bg-secondary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-text-secondary font-bold text-sm tracking-widest uppercase animate-pulse">Loading SpineKare...</p>
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
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-bg-secondary rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-text-secondary font-bold text-sm tracking-widest uppercase animate-pulse">Loading SpineKare...</p>
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
