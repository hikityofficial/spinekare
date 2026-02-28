import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Flame, Shield, Award, ClipboardList, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user } = useAuth();
    const { streak } = useApp();

    const getRiskColor = (tier?: string) => {
        if (tier === 'low') return 'text-accent-green';
        if (tier === 'moderate') return 'text-accent-amber';
        if (tier === 'high' || tier === 'critical') return 'text-accent-red';
        return 'text-text-secondary';
    };

    const getRiskLabel = (tier?: string) => {
        if (tier === 'low') return 'Low Risk';
        if (tier === 'moderate') return 'Moderate Risk';
        if (tier === 'high') return 'High Risk';
        if (tier === 'critical') return 'Critical Risk';
        return 'Unassessed';
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
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start bg-bg-card p-6 md:p-8 rounded-radius-lg border border-border">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-bg-secondary bg-border flex flex-col items-center justify-center text-3xl md:text-4xl text-text-secondary uppercase shadow-[0_0_30px_rgba(0,0,0,0.5)] shrink-0">
                    {user?.fullName?.substring(0, 2) || 'U'}
                </div>

                <div className="flex-1 text-center md:text-left min-w-0">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2 truncate">{user?.fullName || 'Spine Warrior'}</h1>
                    <p className="text-text-secondary mb-4 text-sm capitalize truncate">
                        {user?.occupationType?.replace('Desk job (8+ hrs sitting)', 'Office Worker')} • {user?.ageGroup} • Joined recently
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary text-sm font-bold border border-border">
                            <Shield size={16} className={getRiskColor(user?.riskTier)} />
                            <span className={getRiskColor(user?.riskTier)}>{getRiskLabel(user?.riskTier)}</span>
                            {user?.spineRiskScore !== undefined && <span className="text-text-secondary">· {user.spineRiskScore}/100</span>}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary text-sm font-bold border border-border">
                            <Flame size={16} className="text-accent-amber" />
                            Best: {streak.longestStreak}d
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-secondary text-sm font-bold border border-border">
                            <Award size={16} className="text-accent-cyan" />
                            {streak.totalPoints} pts
                        </span>
                    </div>
                </div>

            </div>

            {/* Primary Risk Reason */}
            {user?.primaryReason && (
                <div className="bg-bg-card border border-border rounded-radius-lg p-5">
                    <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-2">Primary Risk Factor Identified</h2>
                    <p className="text-text-primary text-sm leading-relaxed">{user.primaryReason}</p>
                </div>
            )}


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

            {/* Quick Links (Crucial for Mobile Navigation) */}
            <div className="pt-4 md:hidden">
                <h2 className="text-xl font-display font-bold text-text-primary mb-4">Quick Links</h2>
                <div className="bg-bg-card border border-border rounded-radius-lg overflow-hidden divide-y divide-border">
                    <Link to="/plans" className="flex items-center justify-between p-4 hover:bg-bg-secondary transition-colors group">
                        <div className="flex items-center gap-3 text-text-primary">
                            <div className="p-2 bg-accent-cyan/10 text-accent-cyan rounded-md group-hover:bg-accent-cyan group-hover:text-bg-primary transition-colors">
                                <ClipboardList size={20} />
                            </div>
                            <span className="font-bold">My Plans</span>
                        </div>
                        <ChevronRight size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                    </Link>
                    
                    <Link to="/spine-facts" className="flex items-center justify-between p-4 hover:bg-bg-secondary transition-colors group">
                        <div className="flex items-center gap-3 text-text-primary">
                            <div className="p-2 bg-accent-amber/10 text-accent-amber rounded-md group-hover:bg-accent-amber group-hover:text-bg-primary transition-colors">
                                <Info size={20} />
                            </div>
                            <span className="font-bold">Spine Facts</span>
                        </div>
                        <ChevronRight size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                    </Link>
                    
                    <Link to="/at-risk" className="flex items-center justify-between p-4 hover:bg-bg-secondary transition-colors group">
                        <div className="flex items-center gap-3 text-text-primary">
                            <div className="p-2 bg-accent-red/10 text-accent-red rounded-md group-hover:bg-accent-red group-hover:text-bg-primary transition-colors">
                                <AlertCircle size={20} />
                            </div>
                            <span className="font-bold">Are You At Risk?</span>
                        </div>
                        <ChevronRight size={20} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                    </Link>
                </div>
            </div>

        </div>
    );
}
