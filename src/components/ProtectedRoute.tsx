import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated, user } = useAuth();

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
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user && !user.onboardingComplete) {
            return <Navigate to="/onboarding" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
