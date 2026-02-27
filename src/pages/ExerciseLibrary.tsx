import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllExercises } from '../hooks/useAllExercises';
import { Play, BookOpen, Video, ShieldCheck, X, ImageIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exerciseMeta } from '../utils/exerciseMeta';

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
    Sacral: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12],
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

    const filteredExercises = exercises.filter(ex => allowedNumbers.includes(ex.position));

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
                            const exerciseNum = ex.position; // Sequential 1-12, decoupled from DB id
                            const imageSrc = EXERCISE_IMAGES[(exerciseNum - 1) % EXERCISE_IMAGES.length];
                            const meta = exerciseMeta[exerciseNum];

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
                                        {meta?.duration && (
                                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-bg-card/90 backdrop-blur border border-border text-accent-cyan text-[10px] font-bold flex items-center gap-1">
                                                <Clock size={10} /> {meta.duration}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col gap-2">
                                        <span className="inline-block px-2 py-0.5 bg-bg-secondary border border-border text-text-secondary font-bold text-[10px] uppercase tracking-widest rounded-full w-fit">
                                            {ex.targetArea}
                                        </span>
                                        {meta?.instruction && (
                                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                                                {meta.instruction}
                                            </p>
                                        )}
                                        {meta?.sets && (
                                            <span className="text-[10px] font-bold text-accent-amber">{meta.sets}</span>
                                        )}
                                        {meta?.ageRestriction && (
                                            <span className="text-[10px] font-bold text-accent-red">&#9888; {meta.ageRestriction}</span>
                                        )}
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
                <PrecautionsSection />
            )}
        </div>
     );
}

/* ═══════════════════════════════════════════════════
   Precautions Section — 5 clickable image placeholders
   ═══════════════════════════════════════════════════ */
const PRECAUTION_ITEMS = [
    { id: 1, title: "Consult Your Doctor", caption: "Always get clearance before starting spine exercises." },
    { id: 2, title: "Correct Posture Form", caption: "Maintain neutral spine alignment during all movements." },
    { id: 3, title: "Avoid Overexertion", caption: "Stop immediately if you feel sharp or radiating pain." },
    { id: 4, title: "Warm-Up Routine", caption: "Walk or march in place for 2–3 minutes before stretching." },
    { id: 5, title: "Stay Hydrated", caption: "Drink water before and after to support disc health." },
];

function PrecautionsSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            {/* Warning banner */}
            <div className="flex items-start gap-3 p-4 bg-accent-amber/10 border border-accent-amber/30 rounded-radius-lg">
                <ShieldCheck size={20} className="text-accent-amber shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-text-primary">Important Precautions</p>
                    <p className="text-sm text-text-secondary mt-1">
                        Always consult your physician before starting any exercise programme. Stop immediately if you feel pain.
                    </p>
                </div>
            </div>

            {/* Clickable image grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {PRECAUTION_ITEMS.map((item, i) => (
                    <button
                        key={item.id}
                        onClick={() => setOpenIndex(i)}
                        className="group relative aspect-[3/4] bg-bg-secondary border-2 border-dashed border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/50 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none"
                    >
                        {/* Placeholder overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/80 z-10" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-secondary z-0">
                            <ImageIcon size={36} className="opacity-20 group-hover:opacity-40 transition-opacity" />
                            <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Image {item.id}</span>
                        </div>
                        {/* Label at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                            <p className="text-sm font-bold text-text-primary truncate">{item.title}</p>
                            <p className="text-[11px] text-text-secondary truncate mt-0.5">{item.caption}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {openIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setOpenIndex(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="relative max-w-lg w-full bg-bg-card rounded-radius-lg border border-border overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setOpenIndex(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-bg-secondary/80 backdrop-blur text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <X size={18} />
                            </button>

                            {/* Image placeholder area */}
                            <div className="aspect-[4/3] bg-bg-secondary flex flex-col items-center justify-center gap-4 text-text-secondary">
                                <ImageIcon size={64} className="opacity-20" />
                                <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Precaution Image {PRECAUTION_ITEMS[openIndex].id}</span>
                                <span className="text-xs opacity-30">Replace with actual image</span>
                            </div>

                            {/* Caption */}
                            <div className="p-6">
                                <h3 className="text-xl font-display font-bold text-text-primary mb-2">
                                    {PRECAUTION_ITEMS[openIndex].title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {PRECAUTION_ITEMS[openIndex].caption}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
