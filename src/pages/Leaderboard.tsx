import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Crown, Medal } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Leaderboard() {
    const { streak } = useApp();
    const { user } = useAuth();

    const [leaderboardData, setLeaderboardData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            if (user?.id && !user.id.includes('mock')) {
                const { data, error } = await supabase
                    .from('user_streaks')
                    .select('*, user_profiles(full_name)')
                    .order('total_points', { ascending: false })
                    .limit(50);

                if (data && !error && data.length > 0) {
                    const formatted = data.map((item: any, index: number) => ({
                        rank: index + 1,
                        name: item.user_profiles?.full_name || 'Anonymous',
                        points: item.total_points,
                        streak: item.current_streak,
                        isCurrentUser: item.user_id === user.id
                    }));
                    setLeaderboardData(formatted);
                    return;
                }
            }

            // Fallback if not authenticated, no data, or RLS error
            // setLeaderboardData([]); (Leaving empty if no real users are found)
        };

        fetchLeaderboard();
    }, [user, streak]);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="text-accent-amber" size={24} />;
        if (rank === 2) return <Medal className="text-[#C0C0C0]" size={24} />; // Silver
        if (rank === 3) return <Medal className="text-[#CD7F32]" size={24} />; // Bronze
        return <span className="font-display font-bold text-text-secondary w-6 text-center">{rank}</span>;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="p-3 bg-accent-amber/10 text-accent-amber rounded-radius-lg">
                    <Trophy size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-primary">Global Leaderboard</h1>
                    <p className="text-text-secondary">Ranked by total points earned through daily routines and streaks.</p>
                </div>
            </div>

            <div className="bg-bg-card rounded-radius-lg border border-border overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-bg-secondary text-xs uppercase tracking-widest text-text-secondary font-bold">
                    <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                    <div className="col-span-6 md:col-span-5">Spine Warrior</div>
                    <div className="col-span-4 md:col-span-3 text-right">Streak</div>
                    <div className="col-span-12 md:col-span-3 text-right hidden md:block">Total Points</div>
                </div>

                <div className="divide-y divide-border text-text-primary">
                    {leaderboardData.map((player, idx) => (
                        <React.Fragment key={player.rank}>
                            {idx === 5 && (
                                <div className="grid grid-cols-12 gap-4 p-4 items-center bg-bg-primary/50 text-text-secondary">
                                    <div className="col-span-12 text-center text-sm font-bold tracking-widest">•••</div>
                                </div>
                            )}

                            <div className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-bg-secondary ${player.isCurrentUser ? 'bg-accent-cyan/5' : ''}`}>
                                <div className="col-span-2 md:col-span-1 flex justify-center">
                                    {getRankIcon(player.rank)}
                                </div>

                                <div className="col-span-6 md:col-span-5 font-bold flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs text-text-secondary uppercase">
                                        {player.name.substring(0, 2)}
                                    </div>
                                    <span className={player.isCurrentUser ? 'text-accent-cyan' : ''}>
                                        {player.name}
                                    </span>
                                </div>

                                <div className="col-span-4 md:col-span-3 text-right flex items-center justify-end gap-1 font-bold">
                                    <Flame size={16} className={player.streak > 0 ? "text-accent-amber" : "text-text-secondary/50"} />
                                    <span className={player.streak > 0 ? "text-text-primary" : "text-text-secondary/50"}>
                                        {player.streak}
                                    </span>
                                </div>

                                <div className="col-span-12 md:col-span-3 text-right font-display font-bold text-lg md:text-base mt-2 md:mt-0">
                                    <span className="md:hidden text-xs text-text-secondary font-normal uppercase tracking-widest mr-2">Points:</span>
                                    {player.points.toLocaleString()}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
