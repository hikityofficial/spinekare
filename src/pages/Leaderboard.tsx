import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Crown, Medal, Star, Sparkles, Timer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ── Motivational quotes shown to non-top-3 users at week boundary ──────────
const MOTIVATION_QUOTES = [
    "Champions aren't born in a day. Show up, grind harder, and next week's throne is yours. 💪",
    "Every expert was once a beginner. Keep going — your streak is your superpower. 🔥",
    "The top three trained while others rested. Your moment is coming — make it count. ⚡",
    "One week of consistency beats one week of perfection. Stack those days. 🌱",
    "Your spine, your race. But why not win it? A little more each week. 🏆",
    "Progress isn't always visible, but it's always real. Keep moving. 🚀",
    "The leaderboard doesn't define you — your dedication does. See you at the top! 👑",
];

function getWeeklyMotivation(): string {
    // deterministic quote per week so everyone sees the same one
    const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    return MOTIVATION_QUOTES[week % MOTIVATION_QUOTES.length];
}

// ── Countdown helper ────────────────────────────────────────────────────────
function useCountdown(target: Date) {
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
        const tick = () => {
            const diff = target.getTime() - Date.now();
            if (diff <= 0) { setTimeLeft('Resetting…'); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);

    return timeLeft;
}

// ── Rank icons ──────────────────────────────────────────────────────────────
function RankIcon({ rank }: { rank: number }) {
    if (rank === 1) return <Crown className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" size={26} />;
    if (rank === 2) return <Medal className="text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.7)]" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600 drop-shadow-[0_0_6px_rgba(180,83,9,0.6)]" size={24} />;
    return <span className="font-display font-bold text-text-secondary w-6 text-center text-sm">{rank}</span>;
}

// ── Row background for top-3 ────────────────────────────────────────────────
function rankRowClass(rank: number, isCurrentUser: boolean) {
    const base = 'grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-bg-secondary ';
    if (isCurrentUser) return base + 'bg-accent-cyan/5 border-l-2 border-accent-cyan';
    if (rank === 1) return base + 'bg-yellow-400/5';
    if (rank === 2) return base + 'bg-slate-400/5';
    if (rank === 3) return base + 'bg-amber-700/5';
    return base;
}

// ── Bonus badge ─────────────────────────────────────────────────────────────
function BonusBadge({ rank }: { rank: number }) {
    const bonuses = ['', '+100 pts', '+75 pts', '+50 pts'];
    if (rank > 3) return null;
    return (
        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 whitespace-nowrap">
            {bonuses[rank]} bonus
        </span>
    );
}

export default function Leaderboard() {
    const { streak, weekResetDate } = useApp();
    const { user } = useAuth();
    const countdown = useCountdown(weekResetDate);

    const [leaderboardData, setLeaderboardData] = React.useState<any[]>([]);
    const [hasShownCelebration, setHasShownCelebration] = React.useState(false);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            if (user?.id && !user.id.includes('mock')) {
                const { data, error } = await supabase
                    .from('user_streaks')
                    .select('*, user_profiles(full_name)')
                    .order('weekly_points', { ascending: false })
                    .limit(50);

                if (data && !error && data.length > 0) {
                    const formatted = data
                        .filter((item: any) => (item.weekly_points ?? 0) > 0)
                        .map((item: any, index: number) => ({
                            rank: index + 1,
                            name: item.user_profiles?.full_name || 'Anonymous',
                            points: item.weekly_points ?? 0,
                            totalPoints: item.total_points ?? 0,
                            streak: item.current_streak,
                            isCurrentUser: item.user_id === user.id,
                        }));

                    // Include current user even if weekly_points = 0 (so they always see themselves)
                    const selfInList = formatted.some((p: any) => p.isCurrentUser);
                    if (!selfInList && streak.userId) {
                        formatted.push({
                            rank: formatted.length + 1,
                            name: user.fullName || 'You',
                            points: streak.weeklyPoints,
                            totalPoints: streak.totalPoints,
                            streak: streak.currentStreak,
                            isCurrentUser: true,
                        });
                    }

                    setLeaderboardData(formatted);
                }
            }
        };

        fetchLeaderboard();
    }, [user, streak.weeklyPoints]);

    // Fire confetti when current user is top-3 (only once)
    const currentUserRank = leaderboardData.find((p) => p.isCurrentUser)?.rank;
    React.useEffect(() => {
        if (currentUserRank && currentUserRank <= 3 && !hasShownCelebration && leaderboardData.length > 0) {
            setHasShownCelebration(true);
            const end = Date.now() + 3000;
            const frame = () => {
                confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#facc15', '#00E5CC', '#2ED573'] });
                confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#facc15', '#00E5CC', '#2ED573'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            };
            frame();
        }
    }, [currentUserRank, leaderboardData.length]);

    const isTopThree = currentUserRank !== undefined && currentUserRank <= 3;
    const isRanked = currentUserRank !== undefined;

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-start sm:items-center gap-4 border-b border-border pb-6 flex-wrap">
                <div className="p-3 bg-accent-amber/10 text-accent-amber rounded-radius-lg">
                    <Trophy size={32} />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">Weekly Leaderboard</h1>
                    <p className="text-text-secondary">Points earned this week. Resets every Monday at midnight UTC.</p>
                </div>
                {/* Countdown */}
                <div className="hidden md:flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">
                        <Timer size={13} /> Resets in
                    </div>
                    <span className="text-accent-cyan font-display font-bold text-lg tabular-nums">
                        {countdown}
                    </span>
                </div>
            </div>

            {/* Mobile countdown */}
            <div className="flex md:hidden items-center justify-between px-4 py-3 bg-bg-card border border-border rounded-radius-md">
                <span className="text-xs text-text-secondary font-bold uppercase tracking-widest flex items-center gap-1.5"><Timer size={13} /> Week resets in</span>
                <span className="text-accent-cyan font-display font-bold tabular-nums">{countdown}</span>
            </div>

            {/* ── Celebration Banner (Top 3) ── */}
            <AnimatePresence>
                {isTopThree && (
                    <motion.div
                        key="celebration"
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                        className="relative overflow-hidden rounded-radius-lg border border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 via-accent-amber/10 to-accent-cyan/10 p-6 flex items-start gap-4"
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className="absolute text-yellow-400/20 animate-pulse"
                                    style={{ top: `${15 + i * 12}%`, left: `${5 + i * 15}%`, animationDelay: `${i * 0.3}s` }}
                                />
                            ))}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0 border border-yellow-400/40">
                            <Crown size={22} className="text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
                                🏆 You're #{currentUserRank} this week!
                            </p>
                            <p className="text-text-primary font-semibold text-base leading-relaxed">
                                {currentUserRank === 1
                                    ? "You're the #1 Spine Warrior this week! Absolutely legendary. Keep that crown shining. 👑"
                                    : currentUserRank === 2
                                        ? "Silver this week — an incredible performance. One more push and gold is yours! 🥈"
                                        : "Bronze podium! You've outperformed the vast majority. Keep climbing! 🥉"}
                            </p>
                            <p className="text-xs text-yellow-400/80 mt-2 font-bold">
                                +{[100, 75, 50][currentUserRank - 1]} bonus points will be awarded at the next reset 🎁
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Motivational Quote (non-top-3, ranked users) ── */}
            <AnimatePresence>
                {isRanked && !isTopThree && (
                    <motion.div
                        key="motivation"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-radius-lg border border-accent-cyan/20 bg-accent-cyan/5 p-5 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-accent-cyan/15 flex items-center justify-center shrink-0 border border-accent-cyan/30">
                            <Sparkles size={18} className="text-accent-cyan" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-accent-cyan uppercase tracking-widest mb-1">
                                💬 This week's motivation — You're #{currentUserRank}
                            </p>
                            <p className="text-text-primary font-medium text-base leading-relaxed italic">
                                "{getWeeklyMotivation()}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Leaderboard Table ── */}
            <div className="bg-bg-card rounded-radius-lg border border-border overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-bg-secondary text-xs uppercase tracking-widest text-text-secondary font-bold">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-5">Spine Warrior</div>
                    <div className="col-span-3 text-right">Streak</div>
                    <div className="col-span-3 text-right">Weekly Pts</div>
                </div>

                <div className="divide-y divide-border text-text-primary">
                    {leaderboardData.length === 0 && (
                        <div className="p-12 text-center text-text-secondary">
                            <Trophy size={40} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold">No weekly activity yet.</p>
                            <p className="text-sm mt-1">Complete a routine to appear on the leaderboard!</p>
                        </div>
                    )}

                    {leaderboardData.map((player, idx) => (
                        <React.Fragment key={player.rank}>
                            {/* Divider after top-3 */}
                            {idx === 3 && leaderboardData.length > 3 && (
                                <div className="grid grid-cols-12 gap-4 p-3 items-center bg-bg-primary/40 text-text-secondary/60">
                                    <div className="col-span-12 text-center text-xs font-bold tracking-[0.3em]">• • •</div>
                                </div>
                            )}

                            <motion.div
                                key={player.rank}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className={rankRowClass(player.rank, player.isCurrentUser)}
                            >
                                <div className="col-span-1 flex justify-center">
                                    <RankIcon rank={player.rank} />
                                </div>

                                <div className="col-span-5 font-bold flex items-center gap-3 min-w-0">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs uppercase shrink-0 font-bold
                                        ${player.rank === 1 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                                            : player.rank === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                                                : player.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                                                    : 'bg-border text-text-secondary'}`}
                                    >
                                        {player.name.substring(0, 2)}
                                    </div>
                                    <div className="min-w-0">
                                        <span className={`truncate block ${player.isCurrentUser ? 'text-accent-cyan' : ''}`}>
                                            {player.name} {player.isCurrentUser && <span className="text-xs opacity-60">(you)</span>}
                                        </span>
                                        <BonusBadge rank={player.rank} />
                                    </div>
                                </div>

                                <div className="col-span-3 text-right flex items-center justify-end gap-1 font-bold">
                                    <Flame size={16} className={player.streak > 0 ? 'text-accent-amber' : 'text-text-secondary/40'} />
                                    <span className={player.streak > 0 ? 'text-text-primary' : 'text-text-secondary/40'}>
                                        {player.streak}
                                    </span>
                                </div>

                                <div className="col-span-3 text-right font-display font-bold text-sm md:text-base">
                                    <span className={player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-slate-300' : player.rank === 3 ? 'text-amber-500' : ''}>
                                        {player.points.toLocaleString()}
                                    </span>
                                </div>
                            </motion.div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                    { icon: '🥇', label: 'Gold', desc: '+100 bonus pts at reset', color: 'border-yellow-400/30 bg-yellow-400/5' },
                    { icon: '🥈', label: 'Silver', desc: '+75 bonus pts at reset', color: 'border-slate-400/30 bg-slate-400/5' },
                    { icon: '🥉', label: 'Bronze', desc: '+50 bonus pts at reset', color: 'border-amber-700/30 bg-amber-700/5' },
                ].map(item => (
                    <div key={item.label} className={`flex items-center gap-3 p-4 rounded-radius-md border ${item.color}`}>
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                            <p className="font-bold text-text-primary">{item.label} Reward</p>
                            <p className="text-text-secondary text-xs">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
