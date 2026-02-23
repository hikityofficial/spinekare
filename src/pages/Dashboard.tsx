import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Flame, CheckCircle, PlayCircle, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
    const { streak, todayRoutine, todayFact, hasCompletedToday } = useApp();
    const { user } = useAuth();
    const navigate = useNavigate();

    const getRiskColor = (tier?: string) => {
        if (tier === 'low') return 'text-accent-green bg-accent-green/10 border-accent-green/30';
        if (tier === 'moderate') return 'text-accent-amber bg-accent-amber/10 border-accent-amber/30';
        return 'text-accent-red bg-accent-red/10 border-accent-red/30';
    };

    return (
        <div className="space-y-6">

            {/* Header section with Streak & Risk */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1 bg-bg-card border border-border p-6 rounded-radius-lg flex items-center justify-between shadow-sm">
                    <div>
                        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-1">Current Streak</h2>
                        <div className="flex items-center gap-2">
                            <Flame className={`w-8 h-8 ${streak.currentStreak > 0 ? 'text-accent-amber' : 'text-text-secondary'}`} />
                            <span className="text-3xl font-display font-bold text-text-primary">
                                {streak.currentStreak} Days
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-text-secondary">Total Points</p>
                        <p className="text-2xl font-bold text-accent-cyan">{streak.totalPoints}</p>
                    </div>
                </div>

                <div className={"flex-1 border p-6 rounded-radius-lg flex items-center justify-between " + getRiskColor(user?.riskTier)}>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80">Your Risk Profile</h2>
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-6 h-6" />
                            <span className="text-xl font-bold capitalize">{user?.riskTier || 'Unknown'} Risk</span>
                        </div>
                        <p className="text-sm opacity-80 mt-1">Score: {user?.spineRiskScore}/100</p>
                    </div>
                    <button onClick={() => navigate('/onboarding')} className="text-sm underline opacity-80 hover:opacity-100 transition-opacity">
                        Retake
                    </button>
                </div>
            </div>

            {/* Main Action - Today's Routine */}
            <div className="bg-bg-card border border-border p-8 rounded-radius-lg relative overflow-hidden group hover:border-accent-cyan/50 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 blur-[80px] rounded-full group-hover:bg-accent-cyan/10 transition-colors"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-accent-cyan/10 text-accent-cyan font-bold text-xs uppercase tracking-widest rounded-full mb-3">
                                Daily Assignment
                            </span>
                            <h2 className="text-3xl font-display font-bold text-text-primary">{todayRoutine.title}</h2>
                            <p className="text-text-secondary mt-2">
                                {todayRoutine.exercises.length} Exercises • ~{todayRoutine.estimatedMinutes} Mins
                            </p>
                        </div>

                        {hasCompletedToday && (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 text-accent-green bg-accent-green/10 px-4 py-2 rounded-full border border-accent-green/30">
                                    <CheckCircle size={20} />
                                    <span className="font-bold">Completed</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {!hasCompletedToday ? (
                        <button
                            onClick={() => navigate('/routine')}
                            className="w-full md:w-auto py-4 px-8 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-bold rounded-radius-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,204,0.2)] hover:shadow-[0_0_30px_rgba(0,229,204,0.4)]"
                        >
                            <PlayCircle size={24} />
                            <span className="text-lg">Start Today's Routine</span>
                        </button>
                    ) : (
                        <div className="w-full md:w-auto py-4 px-8 bg-bg-secondary border border-border text-text-secondary font-bold rounded-radius-lg flex items-center justify-center gap-3">
                            See you tomorrow for Day {todayRoutine.dayNumber + 1}!
                        </div>
                    )}
                </div>
            </div>

            {/* Spine Fact */}
            <div className="bg-bg-secondary/50 border border-border p-6 rounded-radius-lg text-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-amber"></div>
                <p className="text-accent-amber text-sm font-bold uppercase tracking-widest mb-3">Did you know?</p>
                <p className="text-lg md:text-xl font-body text-text-primary max-w-2xl mx-auto italic">
                    "{todayFact.fact}"
                </p>
            </div>

        </div >
    );
}
