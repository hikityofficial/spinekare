import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Flame, CheckCircle, PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { getExerciseImage } from '../utils/exerciseImages';
import { motion, AnimatePresence } from 'framer-motion';

function getMotivationalQuote(streak: number): string {
    if (streak >= 30) return "30 days! You're a SpineKare legend. Your discipline is truly inspiring. 👑";
    if (streak >= 14) return "Two weeks of dedication — you're absolutely unstoppable! Keep that fire alive. 🔥";
    if (streak >= 7) return "A whole week strong! Your spine thanks you deeply. You're building greatness. 💪";
    if (streak >= 3) return "You're building a powerful habit. Every step forward matters. Keep going! 🌟";
    return "Every journey starts with a single step. You just took yours — well done! 🌱";
}

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
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="flex-1 bg-bg-card border border-border p-5 rounded-radius-lg flex items-center justify-between shadow-sm">
                    <div>
                        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Current Streak</h2>
                        <div className="flex items-center gap-2">
                            <Flame className={`w-7 h-7 ${streak.currentStreak > 0 ? 'text-accent-amber' : 'text-text-secondary'}`} />
                            <span className="text-2xl font-display font-bold text-text-primary">
                                {streak.currentStreak} Days
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-text-secondary">Total Points</p>
                        <p className="text-xl font-bold text-accent-cyan">{streak.totalPoints}</p>
                    </div>
                </div>

                <div className={"flex-1 border p-5 rounded-radius-lg flex items-center justify-between " + getRiskColor(user?.riskTier)}>
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Your Risk Profile</h2>
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            <span className="text-lg font-bold capitalize">{user?.riskTier || 'Unknown'} Risk</span>
                        </div>
                        <p className="text-xs opacity-80 mt-1">Score: {user?.spineRiskScore}/100</p>
                    </div>
                    <button onClick={() => navigate('/onboarding')} className="text-sm underline opacity-80 hover:opacity-100 transition-opacity shrink-0">
                        Retake
                    </button>
                </div>
            </div>

            {/* Motivational Quote — shown after completing today */}
            <AnimatePresence>
                {hasCompletedToday && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                        className="bg-gradient-to-r from-accent-cyan/10 via-accent-green/10 to-accent-amber/10 border border-accent-cyan/30 rounded-radius-lg p-5 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center shrink-0 border border-accent-cyan/30">
                            <Sparkles size={18} className="text-accent-cyan" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-1">
                                🎉 Today's routine complete — Day {streak.currentStreak} streak!
                            </p>
                            <p className="text-text-primary font-medium text-base leading-relaxed italic">
                                "{getMotivationalQuote(streak.currentStreak)}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Action - Today's Routine */}
            <div className="bg-bg-card border border-border p-5 md:p-8 rounded-radius-lg relative overflow-hidden group hover:border-accent-cyan/50 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 blur-[80px] rounded-full group-hover:bg-accent-cyan/10 transition-colors"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-accent-cyan/10 text-accent-cyan font-bold text-xs uppercase tracking-widest rounded-full mb-3">
                                Daily Assignment
                            </span>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">{todayRoutine.title}</h2>
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

                    {/* Exercise Previews */}
                    <div className="mb-6 md:mb-8 overflow-x-auto pb-4 -mx-6 md:-mx-8 px-6 md:px-8 snap-x">
                        <div className="flex gap-4 w-max">
                            {todayRoutine.exercises.map((ex, i) => (
                                <div key={`${ex.id}-${i}`} className="w-48 bg-bg-primary rounded-radius-md border border-border p-4 shrink-0 snap-start flex flex-col group/card hover:border-accent-cyan/40 transition-colors">
                                    <div className="h-32 mb-3 bg-bg-secondary rounded-radius-sm flex items-center justify-center p-2">
                                        <img
                                            src={getExerciseImage(ex.id)}
                                            alt={ex.name}
                                            className="h-full w-full object-contain group-hover/card:scale-105 transition-transform"
                                        />
                                    </div>
                                    <h3 className="font-bold text-text-primary text-sm truncate" title={ex.name}>{ex.name}</h3>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full capitalize">{ex.targetArea}</span>
                                        <span className="text-xs text-text-secondary font-mono">{Math.floor(ex.durationSeconds / 60)}:{(ex.durationSeconds % 60).toString().padStart(2, '0')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {!hasCompletedToday ? (
                        <button
                            onClick={() => navigate('/routine')}
                            className="w-full py-4 px-8 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-bold rounded-radius-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,204,0.2)] hover:shadow-[0_0_30px_rgba(0,229,204,0.4)]"
                        >
                            <PlayCircle size={24} />
                            <span className="text-lg">Start Today's Routine</span>
                        </button>
                    ) : (
                        <div className="w-full py-4 px-8 bg-bg-secondary border border-border text-text-secondary font-bold rounded-radius-lg flex items-center justify-center gap-3 text-center">
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
