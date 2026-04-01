import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../../assets/sslogo.png';

export const ProtectedRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,204,0.08),transparent_70%)] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-2xl bg-accent-cyan/20 animate-ping"></div>
                        <img src={logo} alt="SpineKare" className="relative h-20 w-20 rounded-2xl object-cover bg-white shadow-xl animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
                            Spine<span className="text-accent-cyan">Kare</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
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
            <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,204,0.08),transparent_70%)] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-2xl bg-accent-cyan/20 animate-ping"></div>
                        <img src={logo} alt="SpineKare" className="relative h-20 w-20 rounded-2xl object-cover bg-white shadow-xl animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
                            Spine<span className="text-accent-cyan">Kare</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
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
