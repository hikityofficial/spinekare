import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllExercises } from '../hooks/useAllExercises';
import { Play, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Lumbar', 'Thoracic', 'Cervical', 'Core', 'Full'];

export default function ExerciseLibrary() {
    const { exercises, isLoading, error } = useAllExercises();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExercises = exercises.filter(ex => {
        const matchesCategory = activeFilter === 'All' || ex.targetArea.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ex.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) {
        return <div className="p-8 text-center text-text-secondary animate-pulse">Loading Exercise Library...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-accent-red">Failed to load exercises: {error}</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Exercise Library</h1>
                <p className="text-text-secondary">Browse all available spine care movements and launch them individually.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-card p-4 rounded-radius-lg border border-border">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${activeFilter === cat
                                    ? 'bg-accent-cyan text-bg-primary shadow-[0_0_15px_rgba(0,229,204,0.3)]'
                                    : 'bg-bg-secondary text-text-secondary border border-border hover:text-text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="w-full md:w-64 relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-radius-md py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map(ex => (
                    <div key={ex.id} className="bg-bg-card border border-border rounded-radius-lg overflow-hidden group hover:border-accent-cyan/50 transition-all flex flex-col h-full shadow-sm hover:shadow-[0_0_30px_rgba(0,229,204,0.1)]">
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block px-3 py-1 bg-bg-secondary border border-border text-text-secondary font-bold text-xs uppercase tracking-widest rounded-full">
                                    {ex.targetArea} spine
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${ex.difficulty === 'beginner' ? 'text-accent-green bg-accent-green/10' :
                                        ex.difficulty === 'intermediate' ? 'text-accent-amber bg-accent-amber/10' :
                                            'text-accent-red bg-accent-red/10'
                                    }`}>
                                    {ex.difficulty}
                                </span>
                            </div>

                            <h3 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">
                                {ex.name}
                            </h3>
                            <p className="text-sm text-accent-cyan mb-4 font-bold">{ex.category}</p>

                            <p className="text-text-secondary flex-1 text-sm line-clamp-3">
                                {ex.whatItDoes || ex.description}
                            </p>

                            <div className="mt-6 flex items-center gap-4 text-sm text-text-secondary font-bold">
                                <span>⏱ {Math.round(ex.durationSeconds / 60) >= 1 ? `${Math.round(ex.durationSeconds / 60)} min` : `${ex.durationSeconds}s`}</span>
                                {ex.reps && <span>🔄 {ex.reps}</span>}
                            </div>
                        </div>

                        <div className="p-4 border-t border-border bg-bg-secondary/30 mt-auto">
                            <button
                                onClick={() => navigate('/routine', { state: { exercises: [ex], title: ex.name } })}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-accent-cyan text-bg-primary rounded-radius-md font-bold hover:bg-accent-cyan-dim transition-colors"
                            >
                                <Play size={18} fill="currentColor" /> Start (+50 pts)
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExercises.length === 0 && (
                <div className="text-center py-20 text-text-secondary">
                    No exercises found for this filter.
                </div>
            )}
        </div>
    );
}
