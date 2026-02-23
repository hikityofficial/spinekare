import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Flame, Shield, Award, Settings } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const { streak } = useApp();

    const getRiskColor = (tier?: string) => {
        if (tier === 'low') return 'text-accent-green';
        if (tier === 'moderate') return 'text-accent-amber';
        return 'text-accent-red';
    };

    const badges = [
        { id: 1, name: "First Step", desc: "Completed first routine", icon: "🌱", earned: true },
        { id: 2, name: "Week Warrior", desc: "7-day streak", icon: "🔥", earned: streak.longestStreak >= 7 },
        { id: 3, name: "Spine Savant", desc: "30-day streak", icon: "👑", earned: streak.longestStreak >= 30 },
        { id: 4, name: "Posture Pro", desc: "Complete 50 routines", icon: "🧘", earned: false },
        { id: 5, name: "Knowledge Keeper", desc: "Read 30 spine facts", icon: "📚", earned: false },
        { id: 6, name: "Risk Reducer", desc: "Risk score drops by 10+", icon: "📉", earned: false }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header / Basic Info */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-bg-card p-8 rounded-radius-lg border border-border">
                <div className="w-32 h-32 rounded-full border-4 border-bg-secondary bg-border flex flex-col items-center justify-center text-4xl text-text-secondary uppercase shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    {user?.fullName?.substring(0, 2) || 'U'}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-display font-bold text-text-primary mb-2">{user?.fullName || 'Spine Warrior'}</h1>
                    <p className="text-text-secondary mb-4 capitalize">
                        {user?.occupationType?.replace('Desk job (8+ hrs sitting)', 'Office Worker')} • {user?.ageGroup} • Joined recently
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary text-sm font-bold border border-border">
                            <Shield size={16} className={getRiskColor(user?.riskTier)} />
                            Risk Score: <span className={getRiskColor(user?.riskTier)}>{user?.spineRiskScore}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary text-sm font-bold border border-border">
                            <Flame size={16} className="text-accent-amber" />
                            Best Streak: {streak.longestStreak}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary text-sm font-bold border border-border">
                            <Award size={16} className="text-accent-cyan" />
                            {streak.totalPoints} pts
                        </span>
                    </div>
                </div>

                <div>
                    <button className="p-3 bg-bg-secondary hover:bg-border rounded-full text-text-secondary transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Badges Section */}
            <div>
                <h2 className="text-xl font-display font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Award className="text-accent-cyan" /> Earned Badges
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map(badge => (
                        <div
                            key={badge.id}
                            className={`p-5 rounded-radius-lg border flex flex-col items-center text-center transition-all ${badge.earned
                                ? 'bg-bg-card border-border hover:border-accent-cyan/50 shadow-sm'
                                : 'bg-bg-primary border-transparent opacity-50 grayscale'
                                }`}
                        >
                            <div className="text-4xl mb-3 filter drop-shadow-md">{badge.icon}</div>
                            <h3 className="font-bold text-text-primary mb-1">{badge.name}</h3>
                            <p className="text-xs text-text-secondary">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
