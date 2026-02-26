import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllExercises } from '../hooks/useAllExercises';
import { Play, BookOpen, Video, ShieldCheck } from 'lucide-react';

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
import video1 from '../../assets/grok-video-5af2fbd2-7619-4dad-a019-5221617876b7.mp4';
import video2 from '../../assets/grok-video-84dec387-9089-4c5b-afa7-ca44e85f80a6.mp4';

const EXERCISE_IMAGES = [sse1, sse2, sse3, sse4, sse5, sse6, sse7, sse8, sse9, sse10, sse11, sse12];

// 1-based exercise numbers per category
const CATEGORY_MAP: Record<string, number[]> = {
    All: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Cervical: [1, 2, 3, 8, 12],
    Lumbar: [1, 2, 3, 12],
    Sacral: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12],
};

const CATEGORIES = ['All', 'Cervical', 'Lumbar', 'Sacral'] as const;
type Category = typeof CATEGORIES[number];

const SECTION_TABS = ['Exercises', 'Videos', 'Precautions'] as const;
type SectionTab = typeof SECTION_TABS[number];

export default function ExerciseLibrary() {
    const { exercises, isLoading, error } = useAllExercises();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [activeSection, setActiveSection] = useState<SectionTab>('Exercises');

    const allowedNumbers = CATEGORY_MAP[activeCategory];

    const filteredExercises = exercises.filter((_, idx) => allowedNumbers.includes(idx + 1));

    if (isLoading) {
        return <div className="p-8 text-center text-text-secondary animate-pulse">Loading Exercise Library...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-accent-red">Failed to load exercises: {error}</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <header>
                <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Exercise Library</h1>
                <p className="text-text-secondary">Browse exercises by region, watch video guides, and view precautions.</p>
            </header>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-border pb-1 overflow-x-auto">
                {SECTION_TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveSection(tab)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-bold transition-colors ${activeSection === tab
                            ? 'bg-bg-card border border-border border-b-bg-card text-accent-cyan -mb-px'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {tab === 'Exercises' && <BookOpen size={15} />}
                        {tab === 'Videos' && <Video size={15} />}
                        {tab === 'Precautions' && <ShieldCheck size={15} />}
                        {tab}
                    </button>
                ))}
            </div>

            {/* ─── EXERCISES TAB ─── */}
            {activeSection === 'Exercises' && (
                <>
                    {/* Category filter */}
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === cat
                                    ? 'bg-accent-cyan text-bg-primary shadow-[0_0_15px_rgba(0,229,204,0.3)]'
                                    : 'bg-bg-secondary text-text-secondary border border-border hover:text-text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredExercises.map((ex) => {
                            const exerciseNum = exercises.indexOf(ex) + 1; // original 1-based number
                            const imageSrc = EXERCISE_IMAGES[(exerciseNum - 1) % EXERCISE_IMAGES.length];

                            return (
                                <div
                                    key={ex.id}
                                    className="group bg-bg-card border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/40 transition-all shadow-sm flex flex-col"
                                >
                                    <div className="relative aspect-[4/3] bg-bg-secondary">
                                        <img src={imageSrc} alt={`Exercise ${exerciseNum}`} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-bg-card/90 backdrop-blur border border-border text-text-primary text-xs font-extrabold">
                                            {String(exerciseNum).padStart(2, '0')}
                                        </div>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col gap-2">
                                        <span className="inline-block px-2 py-0.5 bg-bg-secondary border border-border text-text-secondary font-bold text-[10px] uppercase tracking-widest rounded-full w-fit">
                                            {ex.targetArea}
                                        </span>
                                        <button
                                            onClick={() => navigate('/routine', { state: { exercises: [ex], title: `Exercise ${String(exerciseNum).padStart(2, '0')}` } })}
                                            className="mt-auto w-full flex items-center justify-center gap-1.5 py-2 bg-accent-cyan/10 hover:bg-accent-cyan text-accent-cyan hover:text-bg-primary border border-accent-cyan/30 rounded-radius-md font-bold text-xs transition-colors"
                                        >
                                            <Play size={13} fill="currentColor" /> Start
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredExercises.length === 0 && (
                        <div className="text-center py-16 text-text-secondary">No exercises in this category.</div>
                    )}
                </>
            )}

            {/* ─── VIDEOS TAB ─── */}
            {activeSection === 'Videos' && (
                <div className="space-y-6">
                    <p className="text-text-secondary text-sm">Educational video guides for spine care exercises.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[video1, video2].map((src, i) => (
                            <div key={i} className="bg-bg-card border border-border rounded-radius-lg overflow-hidden shadow-sm">
                                <video
                                    src={src}
                                    controls
                                    className="w-full aspect-video bg-black"
                                    preload="metadata"
                                />
                                <div className="p-4">
                                    <p className="font-bold text-text-primary">Spine Care Guide {i + 1}</p>
                                    <p className="text-xs text-text-secondary mt-1">Watch and follow along with proper form.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── PRECAUTIONS TAB ─── */}
            {activeSection === 'Precautions' && (
                <div className="space-y-6">
                    <div className="flex items-start gap-3 p-4 bg-accent-amber/10 border border-accent-amber/30 rounded-radius-lg">
                        <ShieldCheck size={20} className="text-accent-amber shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-text-primary">Important Precautions</p>
                            <p className="text-sm text-text-secondary mt-1">
                                Always consult your physician before starting any exercise programme. Stop immediately if you feel pain.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: "Consult Your Doctor First", desc: "If you have a herniated disc, spinal stenosis, or recent surgery, get medical clearance before starting any spine exercises.", icon: "🩺" },
                            { title: "Stop If You Feel Sharp Pain", desc: "Mild stretching discomfort is normal, but sharp, shooting, or radiating pain means stop immediately and consult a specialist.", icon: "⚠️" },
                            { title: "Avoid Jerky Movements", desc: "All spine exercises should be performed with slow, controlled motions. Never bounce or use momentum.", icon: "🐢" },
                            { title: "Warm Up Before Starting", desc: "Walk for 2–3 minutes or do gentle marching in place before attempting stretches to avoid muscle strain.", icon: "🔥" },
                            { title: "Maintain Neutral Spine", desc: "During exercises, keep your spine in a natural position. Avoid over-arching or rounding your back excessively.", icon: "🧘" },
                            { title: "Stay Hydrated", desc: "Spinal discs rely on hydration. Drink water before and after exercising to support disc health and elasticity.", icon: "💧" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-bg-card border border-border rounded-radius-lg p-5 hover:border-accent-cyan/40 transition-colors"
                            >
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h4 className="font-bold text-text-primary mb-2">{item.title}</h4>
                                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
