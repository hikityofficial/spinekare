import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    Home, Award, User, AlertCircle, Info, LogOut, Flame, BookOpen, ClipboardList, Shield
} from 'lucide-react';
import SpineModel3D from '../components/SpineModel3D';
import ConsultationFinder from '../components/ConsultationFinder';
import logo from '../../assets/sslogo.png';

export const DashboardLayout = () => {
    const { streak } = useApp();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getRiskColor = (tier?: string) => {
        if (tier === 'low') return 'text-accent-green';
        if (tier === 'moderate') return 'text-accent-amber';
        if (tier === 'high' || tier === 'critical') return 'text-accent-red';
        return 'text-text-secondary';
    };

    // Shared navbar stats pills
    const NavStats = () => (
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-bg-card border border-border rounded-full shadow-sm" title="Current streak">
                <Flame size={14} className={streak.currentStreak > 0 ? 'text-accent-amber' : 'text-text-secondary'} />
                <span className="font-bold text-xs tracking-wide text-text-primary">{streak.currentStreak}d</span>
            </div>
            {/* Risk Score */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-bg-card border border-border rounded-full shadow-sm" title="Risk score">
                <Shield size={14} className={getRiskColor(user?.riskTier)} />
                <span className="font-bold text-xs tracking-wide text-text-primary">{user?.spineRiskScore ?? '—'}</span>
            </div>
            {/* Points */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-bg-card border border-border rounded-full shadow-sm" title="Total points">
                <Award size={14} className="text-accent-cyan" />
                <span className="font-bold text-xs tracking-wide text-text-primary">{streak.totalPoints}pts</span>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-bg-primary text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-bg-secondary flex-col hidden md:flex">
                <div className="p-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <img src={logo} alt="SpineKare" className="h-9 w-9 rounded-md object-contain bg-white shrink-0" />
                        <h1 className="text-xl font-extrabold font-display tracking-tight flex items-center gap-0.5 truncate">
                            Spine<span className="text-accent-cyan">Kare</span>
                        </h1>
                    </div>
                </div>

                {/* Stats row in sidebar */}
                <div className="px-4 pb-3">
                    <NavStats />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] border-y border-border/50 my-2 relative">
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
            <main className="flex-1 overflow-y-auto flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-3 border-b border-border bg-bg-secondary sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="SpineKare" className="h-8 w-8 rounded-md object-contain bg-white" />
                        <h1 className="text-lg font-extrabold font-display tracking-tight text-text-primary">
                            Spine<span className="text-accent-cyan">Kare</span>
                        </h1>
                    </div>
                    <NavStats />
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-10 flex-1">
                    <Outlet />
                </div>

                {/* Footer */}
                <footer className="border-t border-border bg-bg-secondary/50 py-3 text-center text-xs text-text-secondary">
                    Made by{' '}
                    <a
                        href="https://hikity.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-cyan font-bold hover:underline"
                    >
                        Hikity
                    </a>
                </footer>
            </main>

            {/* Right Sidebar for Desktop — Consultation Finder */}
            <aside className="w-72 border-l border-border bg-bg-primary hidden xl:flex flex-col items-center p-4">
                <ConsultationFinder />
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-bg-secondary border-t border-border flex md:hidden items-center justify-around py-2 px-1">
                <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-accent-cyan transition-colors px-2 py-1">
                    <Home size={20} /><span className="text-[10px] font-bold">Home</span>
                </Link>
                <Link to="/library" className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-accent-cyan transition-colors px-2 py-1">
                    <BookOpen size={20} /><span className="text-[10px] font-bold">Library</span>
                </Link>
                <Link to="/leaderboard" className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-accent-cyan transition-colors px-2 py-1">
                    <Award size={20} /><span className="text-[10px] font-bold">Rank</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-accent-cyan transition-colors px-2 py-1">
                    <User size={20} /><span className="text-[10px] font-bold">Profile</span>
                </Link>
            </nav>
        </div>
    );
};
