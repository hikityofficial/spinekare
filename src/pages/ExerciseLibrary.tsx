import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllExercises } from '../hooks/useAllExercises';
import { Play, BookOpen, Video, ShieldCheck, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exerciseMeta } from '../utils/exerciseMeta';
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
import rp1 from '../../assets/rp1.png';
import rp2 from '../../assets/rp2.png';
import rp3 from '../../assets/rp3.png';
import rp4 from '../../assets/rp4.png';
import rp5 from '../../assets/rp5.png';
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
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
                            const displayName = meta?.name ?? ex.name;
                            const displayArea = meta?.targetArea ?? ex.targetArea;

                            return (
                                <button
                                    key={ex.id}
                                    onClick={() => setSelectedExercise(ex)}
                                    className="group relative bg-bg-card border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/40 transition-all shadow-sm flex flex-col text-left focus:outline-none"
                                >
                                    <div className="w-full relative aspect-[4/3] bg-bg-secondary">
                                        <img src={imageSrc} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-bg-card/90 backdrop-blur border border-border text-text-primary text-xs font-extrabold z-10">
                                            {String(exerciseNum).padStart(2, '0')}
                                        </div>
                                        {meta?.duration && (
                                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-bg-card/90 backdrop-blur border border-border text-accent-cyan text-[10px] font-bold flex items-center gap-1 z-10">
                                                <Clock size={10} /> {meta.duration}
                                            </div>
                                        )}
                                        {/* Overlay gradient on hover */}
                                        <div className="absolute inset-0 bg-accent-cyan/0 group-hover:bg-accent-cyan/10 transition-colors duration-300 z-0"></div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col gap-2 w-full">
                                        {/* Exercise name */}
                                        <p className="text-text-primary font-bold text-sm leading-tight line-clamp-2">{displayName}</p>
                                        
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {/* Target area tag */}
                                            <span className="inline-flex px-2 py-0.5 bg-bg-secondary border border-border text-text-secondary font-bold text-[10px] uppercase tracking-widest rounded-full">
                                                {displayArea}
                                            </span>
                                            {meta?.sets && (
                                                <span className="inline-flex px-2 py-0.5 bg-accent-amber/10 border border-accent-amber/20 text-accent-amber font-bold text-[10px] rounded-full">
                                                    {meta.sets}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {meta?.ageRestriction && (
                                            <span className="text-[10px] font-bold text-accent-red mt-1 flex items-center gap-1">
                                                <ShieldCheck size={12} /> Age ≤ 25 only
                                            </span>
                                        )}
                                        
                                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-1">
                                            Click to view instructions
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {filteredExercises.length === 0 && (
                        <div className="text-center py-16 text-text-secondary">No exercises in this category.</div>
                    )}

                    {/* Exercise Instruction Modal */}
                    <AnimatePresence>
                        {selectedExercise && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[70] bg-bg-primary/80 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto"
                                onClick={() => setSelectedExercise(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.95, opacity: 0, y: 30 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    className="relative max-w-5xl w-full min-h-[70vh] max-h-[90vh] lg:h-[80vh] bg-bg-card rounded-3xl border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row overflow-hidden"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Left: Image Side */}
                                    <div className="w-full lg:w-1/2 lg:flex-shrink-0 bg-bg-secondary relative flex flex-col items-center justify-center min-h-[250px] lg:min-h-full p-8 lg:p-16">
                                        <img 
                                            src={EXERCISE_IMAGES[(selectedExercise.position - 1) % EXERCISE_IMAGES.length]} 
                                            alt={selectedExercise.name} 
                                            className="w-full h-full object-contain mix-blend-multiply opacity-95 relative z-10" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/10 to-transparent pointer-events-none" />
                                        
                                        {/* Mobile Close Button (shows only on mobile, top right over image) */}
                                        <button
                                            onClick={() => setSelectedExercise(null)}
                                            className="lg:hidden absolute top-4 right-4 z-20 p-2.5 rounded-full bg-bg-card/80 backdrop-blur-md text-text-primary hover:bg-bg-card shadow-sm border border-border transition-all flex items-center justify-center"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Right: Content Side */}
                                    <div className="flex-1 flex flex-col bg-bg-card lg:overflow-hidden relative">
                                        {/* Desktop Close Button */}
                                        <div className="hidden lg:flex justify-end absolute top-6 right-6 z-20">
                                            <button
                                                onClick={() => setSelectedExercise(null)}
                                                className="p-2.5 rounded-full bg-bg-secondary/50 text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-border transition-all"
                                            >
                                                <X size={22} />
                                            </button>
                                        </div>

                                        <div className="p-6 md:p-10 lg:p-12 flex-1 lg:overflow-y-auto flex flex-col lg:pr-20">
                                            {/* Subtitle / Tag */}
                                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-cyan/10 text-accent-cyan text-[11px] font-bold tracking-widest uppercase rounded-full mb-5 border border-accent-cyan/20 w-fit">
                                                {exerciseMeta[selectedExercise.position]?.targetArea ?? selectedExercise.targetArea} Spine
                                            </div>
                                            
                                            {/* Title */}
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-text-primary mb-8 leading-tight tracking-tight">
                                                {exerciseMeta[selectedExercise.position]?.name ?? selectedExercise.name}
                                            </h2>

                                            <div className="space-y-8 flex-1">
                                                {/* Instructions section */}
                                                {exerciseMeta[selectedExercise.position]?.instruction && (
                                                    <div className="space-y-3">
                                                        <h3 className="text-xs font-extrabold text-text-secondary flex items-center gap-2 uppercase tracking-widest">
                                                            <BookOpen size={16} className="text-accent-cyan" /> Technique
                                                        </h3>
                                                        <p className="text-text-primary text-[15px] md:text-base leading-relaxed font-medium">
                                                            {exerciseMeta[selectedExercise.position].instruction}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Form Cues */}
                                                {exerciseMeta[selectedExercise.position]?.formCues && (
                                                    <div className="bg-bg-secondary/40 p-6 rounded-2xl border border-border shadow-sm">
                                                        <h3 className="text-xs font-extrabold text-text-secondary mb-4 uppercase tracking-widest">Clinical Form Cues</h3>
                                                        <ul className="space-y-3">
                                                            {exerciseMeta[selectedExercise.position].formCues.map((cue, i) => (
                                                                <li key={i} className="flex items-start gap-3 text-[15px] text-text-primary font-medium">
                                                                    <span className="text-accent-cyan mt-[3px] font-bold bg-accent-cyan/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs shadow-sm">✓</span>
                                                                    <span className="leading-snug">{cue}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Badges details */}
                                                <div className="flex flex-wrap gap-3 pt-4">
                                                    {exerciseMeta[selectedExercise.position]?.duration && (
                                                        <div className="flex items-center gap-2.5 px-4 py-2 bg-bg-primary border border-border shadow-sm rounded-xl">
                                                            <Clock size={16} className="text-accent-cyan" />
                                                            <span className="text-sm font-bold text-text-primary">{exerciseMeta[selectedExercise.position].duration}</span>
                                                        </div>
                                                    )}
                                                    {exerciseMeta[selectedExercise.position]?.reps && (
                                                        <div className="flex items-center gap-2.5 px-4 py-2 bg-bg-primary border border-border shadow-sm rounded-xl">
                                                            <span className="text-accent-green font-bold text-base leading-none">🔁</span>
                                                            <span className="text-sm font-bold text-text-primary">{exerciseMeta[selectedExercise.position].reps}</span>
                                                        </div>
                                                    )}
                                                    {exerciseMeta[selectedExercise.position]?.sets && (
                                                        <div className="flex items-center gap-2.5 px-4 py-2 bg-bg-primary border border-border shadow-sm rounded-xl">
                                                            <span className="text-accent-amber font-bold text-base leading-none">🔄</span>
                                                            <span className="text-sm font-bold text-text-primary">{exerciseMeta[selectedExercise.position].sets}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-10 pt-8 border-t border-border">
                                                <button
                                                    onClick={() => navigate('/routine', { 
                                                        state: { 
                                                            exercises: [selectedExercise], 
                                                            title: exerciseMeta[selectedExercise.position]?.name ?? selectedExercise.name 
                                                        } 
                                                    })}
                                                    className="w-full py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-extrabold rounded-2xl transition-all shadow-[0_8px_16px_rgba(0,229,204,0.25)] hover:shadow-[0_12px_24px_rgba(0,229,204,0.35)] hover:-translate-y-0.5 text-lg flex items-center justify-center gap-2 tracking-wide"
                                                >
                                                    <Play size={20} fill="currentColor" /> Begin Exercise
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
    { id: 1, title: "Maintain Posture", caption: "Keep your spine aligned neutrally throughout the day.", img: rp1 },
    { id: 2, title: "Use a Laptop Stand", caption: "Elevate your screen to eye level to prevent neck strain.", img: rp2 },
    { id: 3, title: "Reduce Stair Usage", caption: "Minimize climbing stairs to reduce pressure on lumbar discs.", img: rp3 },
    { id: 4, title: "Avoid Heavy Lifting", caption: "Protect your back by avoiding heavy weights.", img: rp4 },
    { id: 5, title: "Wear a Waist Belt", caption: "Use a lumbar support belt while traveling to prevent jolts.", img: rp5 },
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
                        className="group relative aspect-[3/4] bg-bg-secondary border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/50 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none"
                    >
                        <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent z-10" />
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
                                className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-black/90 transition-all flex items-center gap-1.5 text-sm font-bold shadow-xl border border-white/10"
                            >
                                <X size={18} /> Back
                            </button>

                            {/* Image area */}
                            <div className="w-full bg-bg-secondary relative max-h-[50vh] flex items-center justify-center overflow-hidden border-b border-border p-4">
                                <img src={PRECAUTION_ITEMS[openIndex].img} alt={PRECAUTION_ITEMS[openIndex].title} className="w-full h-full object-contain max-h-[45vh]" />
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
