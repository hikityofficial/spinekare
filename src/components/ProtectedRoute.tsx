import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-secondary animate-pulse">Loading session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
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
        return <div className="min-h-screen bg-bg-primary flex items-center justify-center text-text-secondary animate-pulse">Loading session...</div>;
    }

    if (isAuthenticated) {
        if (user && !user.onboardingComplete) {
            return <Navigate to="/onboarding" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
