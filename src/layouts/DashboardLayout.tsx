import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    Home, Award, User, AlertCircle, Info, LogOut, Flame, BookOpen, ClipboardList
} from 'lucide-react';
import SpineModel3D from '../components/SpineModel3D';
import AdPlaceholder from '../components/AdPlaceholder';

export const DashboardLayout = () => {
    const { streak } = useApp();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen w-full bg-bg-primary text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-bg-secondary flex flex-col hidden md:flex">
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                        <span className="text-accent-cyan">Spin</span>Care
                    </h1>
                    <div className="flex items-center gap-1.5 text-text-primary px-3 py-1 bg-bg-card border border-border rounded-full shadow-sm" title="Your daily streak">
                        <Flame size={16} className={streak.currentStreak > 0 ? "text-accent-amber" : "text-text-secondary"} />
                        <span className="font-bold text-sm tracking-wide">{streak.currentStreak}</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border-y border-border/50 my-2 relative">
                    <SpineModel3D activeArea="none" />
                    <div className="absolute bottom-4 text-center w-full pointer-events-none">
                        <span className="text-xs text-text-secondary font-bold tracking-widest uppercase bg-bg-secondary/80 px-2 py-1 rounded">Interactive</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-primary">
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/library" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-secondary hover:text-text-primary">
                        <BookOpen size={20} /> Library
                    </Link>
                    <Link to="/plans" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-secondary hover:text-text-primary">
                        <ClipboardList size={20} /> My Plans
                    </Link>
                    <Link to="/leaderboard" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-secondary hover:text-text-primary">
                        <Award size={20} /> Leaderboard
                    </Link>
                    <Link to="/at-risk" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-secondary hover:text-text-primary">
                        <AlertCircle size={20} /> Are You At Risk?
                    </Link>
                    <Link to="/spine-facts" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-secondary hover:text-text-primary">
                        <Info size={20} /> Spine Facts
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-radius-lg hover:bg-bg-card transition-colors text-text-secondary hover:text-text-primary">
                        <User size={20} /> Profile
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-radius-lg hover:bg-red-500/10 hover:text-accent-red transition-colors text-text-secondary"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-bg-secondary">
                    <h1 className="text-xl font-bold font-display text-accent-cyan">SpinCare</h1>

                    <div className="flex items-center gap-1.5 text-text-primary px-3 py-1 bg-bg-card border border-border rounded-full shadow-sm" title="Your daily streak">
                        <Flame size={16} className={streak.currentStreak > 0 ? "text-accent-amber" : "text-text-secondary"} />
                        <span className="font-bold text-sm tracking-wide">{streak.currentStreak}</span>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-full pb-24 md:pb-8">
                    <Outlet />
                </div>
            </main>

            {/* Right Sidebar for Desktop AdSense */}
            <aside className="w-40 xl:w-64 border-l border-border bg-bg-primary hidden lg:flex flex-col items-center p-4">
                <AdPlaceholder type="sidebar" />
            </aside>

            {/* Mobile Bottom Ad Banner */}
            <div className="fixed bottom-0 left-0 w-full z-50 bg-bg-secondary border-t border-border flex md:hidden items-center justify-center">
                <AdPlaceholder type="banner" className="h-[50px] rounded-none border-none" />
            </div>
        </div>
    );
};
