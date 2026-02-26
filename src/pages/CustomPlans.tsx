import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllExercises } from '../hooks/useAllExercises';
import { Play, Plus, Trash2, Save, X, ClipboardList } from 'lucide-react';
import type { Exercise } from '../types';

import sse1 from '../../assets/sse1.png';
import sse2 from '../../assets/sse2.png';
import sse3 from '../../assets/sse3.png';
import sse4 from '../../assets/sse4.png';
import sse5 from '../../assets/sse5.png';
import sse6 from '../../assets/sse6.png';
import sse7 from '../../assets/sse7.png';
import sse8 from '../../assets/sse8.png';
import sse9 from '../../assets/sse9.png';
import sse10 from '../../assets/sse10.png';
import sse11 from '../../assets/sse11.png';
import sse12 from '../../assets/sse12.png';

const EXERCISE_IMAGES = [sse1, sse2, sse3, sse4, sse5, sse6, sse7, sse8, sse9, sse10, sse11, sse12];

interface SavedPlan {
    id: string;
    name: string;
    exerciseIds: readonly number[];
    createdAt: number;
}

export default function CustomPlans() {
    const { exercises, isLoading } = useAllExercises();
    const navigate = useNavigate();

    // Editor state
    const [isCreating, setIsCreating] = planEditorInitState();
    const [planName, setPlanName] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

    // Saved plans state
    const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

    useEffect(() => {
        const loaded = localStorage.getItem('spinekare_custom_plans');
        if (loaded) {
            try {
                setSavedPlans(JSON.parse(loaded));
            } catch (e) {
                console.error("Failed to parse saved plans", e);
            }
        }
    }, []);

    const savePlansToStorage = (plans: SavedPlan[]) => {
        localStorage.setItem('spinekare_custom_plans', JSON.stringify(plans));
        setSavedPlans(plans);
    };

    function planEditorInitState() {
        return useState(false);
    }

    const handleAddExercise = (ex: Exercise) => {
        setSelectedExercises(prev => [...prev, ex]);
    };

    const handleRemoveExercise = (index: number) => {
        setSelectedExercises(prev => prev.filter((_, i) => i !== index));
    };

    const handleSavePlan = () => {
        if (!planName.trim() || selectedExercises.length === 0) return;

        const newPlan: SavedPlan = {
            id: Date.now().toString(),
            name: planName.trim(),
            exerciseIds: selectedExercises.map(e => e.id),
            createdAt: Date.now()
        };

        savePlansToStorage([newPlan, ...savedPlans]);
        setIsCreating(false);
        setPlanName('');
        setSelectedExercises([]);
    };

    const handleDeletePlan = (id: string) => {
        if (window.confirm("Delete this custom plan?")) {
            savePlansToStorage(savedPlans.filter(p => p.id !== id));
        }
    };

    const handleRunPlan = (plan: SavedPlan) => {
        // Map saved IDs back to full Exercise objects
        const planExercises = plan.exerciseIds
            .map(id => exercises.find(e => e.id === id))
            .filter(Boolean) as Exercise[];

        if (planExercises.length > 0) {
            navigate('/routine', { state: { exercises: planExercises, title: plan.name } });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-text-secondary animate-pulse">Loading Plans...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-primary mb-2">My Custom Plans</h1>
                    <p className="text-text-secondary">Build or run exercise sequences recommended by your doctor.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-radius-md font-bold hover:bg-accent-cyan-dim transition-colors flex items-center gap-2 justify-center"
                    >
                        <Plus size={20} /> Build New Plan
                    </button>
                )}
            </header>

            {isCreating ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Exercise Library Picker */}
                    <div className="bg-bg-card border border-border rounded-radius-lg p-4 sm:p-6 flex flex-col" style={{ minHeight: '320px', maxHeight: '75vh' }}>
                        <h2 className="text-xl font-bold font-display mb-4">Select Exercises</h2>
                        <div className="overflow-y-auto flex-1 pr-2 space-y-3 scrollbar-hide">
                            {exercises.map((ex, idx) => {
                                const title = `Exercise ${String(idx + 1).padStart(2, '0')}`;
                                const imageSrc = EXERCISE_IMAGES[idx % EXERCISE_IMAGES.length];

                                return (
                                    <div key={ex.id} className="flex items-center justify-between p-3 bg-bg-secondary border border-border rounded-radius-md hover:border-accent-cyan/30 transition-colors gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-14 h-14 rounded-radius-md overflow-hidden border border-border bg-bg-card flex-shrink-0">
                                                <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-text-primary truncate">{title}</p>
                                                <p className="text-xs text-text-secondary">
                                                    {Math.round(ex.durationSeconds / 60) >= 1 ? `${Math.round(ex.durationSeconds / 60)}m` : `${ex.durationSeconds}s`} • {ex.targetArea} • {ex.difficulty}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddExercise(ex)}
                                            className="p-2 bg-accent-cyan/10 text-accent-cyan rounded-full hover:bg-accent-cyan hover:text-bg-primary transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Plan Builder */}
                    <div className="bg-bg-card border border-border rounded-radius-lg p-4 sm:p-6 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] relative" style={{ minHeight: '320px', maxHeight: '75vh' }}>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="absolute top-6 right-6 text-text-secondary hover:text-text-primary"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold font-display mb-6">Build Plan</h2>

                        <input
                            type="text"
                            placeholder="Plan Name (e.g. Doctor's Morning Routine)"
                            value={planName}
                            onChange={e => setPlanName(e.target.value)}
                            className="w-full bg-bg-secondary border border-border focus:border-accent-cyan rounded-radius-md py-3 px-4 mb-6 text-text-primary outline-none"
                            autoFocus
                        />

                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-6 scrollbar-hide">
                            {selectedExercises.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
                                    <ClipboardList size={48} className="mb-4" />
                                    <p>Select exercises from the left</p>
                                </div>
                            ) : (
                                selectedExercises.map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-bg-secondary border border-border rounded-radius-md group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-text-secondary font-bold w-4">{i + 1}.</span>
                                            <div>
                                                <p className="font-extrabold text-text-primary">Exercise {String(i + 1).padStart(2, '0')}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveExercise(i)}
                                            className="p-1.5 text-text-secondary hover:bg-accent-red/20 hover:text-accent-red rounded transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t border-border mt-auto">
                            <button
                                onClick={handleSavePlan}
                                disabled={selectedExercises.length === 0 || !planName.trim()}
                                className="w-full py-4 bg-accent-cyan text-bg-primary rounded-radius-md font-bold hover:bg-accent-cyan-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> Save Custom Plan
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPlans.length === 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-radius-lg">
                            <ClipboardList size={48} className="mx-auto text-text-secondary opacity-50 mb-4" />
                            <h3 className="text-xl font-bold text-text-primary mb-2">No Plans Yet</h3>
                            <p className="text-text-secondary mb-6">Create a personalized sequence of exercises.</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="px-6 py-2 bg-bg-secondary border border-border hover:border-accent-cyan text-text-primary rounded-full transition-colors font-bold"
                            >
                                Build Plan
                            </button>
                        </div>
                    ) : (
                        savedPlans.map(plan => (
                            <div key={plan.id} className="bg-bg-card border border-border rounded-radius-lg p-6 flex flex-col group hover:border-accent-cyan/50 transition-colors shadow-sm cursor-default">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-accent-cyan/10 text-accent-cyan text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        {plan.exerciseIds.length} Exercises
                                    </div>
                                    <button
                                        onClick={() => handleDeletePlan(plan.id)}
                                        className="text-text-secondary hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <h3 className="text-xl font-display font-bold text-text-primary mb-1 truncate">{plan.name}</h3>
                                <p className="text-xs text-text-secondary mb-8">Created {new Date(plan.createdAt).toLocaleDateString()}</p>

                                <button
                                    onClick={() => handleRunPlan(plan)}
                                    className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-bg-secondary border border-border text-text-primary rounded-radius-md font-bold group-hover:bg-accent-cyan group-hover:text-bg-primary group-hover:border-accent-cyan transition-colors"
                                >
                                    <Play size={18} fill="currentColor" /> Run Plan
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
