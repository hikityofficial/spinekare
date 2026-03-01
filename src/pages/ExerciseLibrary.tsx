import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllExercises } from '../hooks/useAllExercises';
import { Play, BookOpen, Video, ShieldCheck, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
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

    const { user } = useAuth();

    const allowedNumbers = CATEGORY_MAP[activeCategory];

    const filteredExercises = exercises.filter(ex => {
        if (!allowedNumbers.includes(ex.position)) return false;
        // Exercise 12 is restricted to Under 20 only
        if (ex.position === 12 && user?.ageGroup !== 'Under 20') {
            return false;
        }
        return true;
    });

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

                    {/* Exercise Instruction Modal - Top Anchored Card */}
                    <AnimatePresence>
                        {selectedExercise && (
                            <div className="fixed inset-0 z-[100] flex justify-center items-start pt-4 sm:pt-6 md:pt-10 px-4">
                                {/* Dimmed Backdrop */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedExercise(null)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                />

                                {/* Card Content */}
                                <motion.div
                                    initial={{ y: "-100%", opacity: 0.5 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "-100%", opacity: 0 }}
                                    transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.8 }}
                                    className="relative w-full sm:max-w-3xl lg:max-w-4xl bg-bg-card rounded-3xl sm:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row border border-border z-10 overflow-hidden max-h-[90vh] sm:max-h-[85vh] mt-safe"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Image Header Block (Top on mobile, Left on desktop) */}
                                    <div className="w-full md:w-[45%] lg:w-2/5 relative bg-bg-secondary shrink-0 overflow-hidden flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border min-h-[220px]">
                                        <img 
                                            src={EXERCISE_IMAGES[(selectedExercise.position - 1) % EXERCISE_IMAGES.length]} 
                                            alt={selectedExercise.name} 
                                            className="w-full h-full object-contain mix-blend-multiply relative z-10 max-h-[35vh]" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/10 to-transparent pointer-events-none" />
                                        
                                        {/* Tag */}
                                        <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 px-3 py-1.5 bg-bg-card/90 backdrop-blur border border-border text-accent-cyan text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm">
                                            {exerciseMeta[selectedExercise.position]?.targetArea ?? selectedExercise.targetArea} Spine
                                        </div>

                                        {/* Mobile Close Button */}
                                        <button
                                            onClick={() => setSelectedExercise(null)}
                                            className="md:hidden absolute top-5 right-5 z-20 p-2.5 rounded-full bg-bg-card/90 backdrop-blur text-text-primary hover:bg-bg-primary shadow-lg border border-border flex items-center justify-center transition-transform active:scale-95"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Scrolling Details Block */}
                                    <div className="flex-1 flex flex-col overflow-hidden relative bg-bg-card">
                                        {/* Desktop Close Button */}
                                        <button
                                            onClick={() => setSelectedExercise(null)}
                                            className="hidden md:flex absolute top-6 right-6 z-20 p-2.5 rounded-full bg-bg-secondary hover:bg-border text-text-secondary hover:text-text-primary transition-all items-center justify-center cursor-pointer active:scale-95"
                                        >
                                            <X size={22} />
                                        </button>

                                        {/* Scrollable Text Area */}
                                        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 w-full">
                                            {/* Header */}
                                            <div className="md:pr-14">
                                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-text-primary leading-tight tracking-tight mb-4">
                                                    {exerciseMeta[selectedExercise.position]?.name ?? selectedExercise.name}
                                                </h2>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {exerciseMeta[selectedExercise.position]?.duration && (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border shadow-sm rounded-lg">
                                                            <Clock size={16} className="text-accent-cyan" />
                                                            <span className="text-sm font-bold text-text-primary">{exerciseMeta[selectedExercise.position].duration}</span>
                                                        </div>
                                                    )}
                                                    {exerciseMeta[selectedExercise.position]?.reps && (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border shadow-sm rounded-lg">
                                                            <span className="text-accent-green text-sm font-bold leading-none">🔁</span>
                                                            <span className="text-sm font-bold text-text-primary">{exerciseMeta[selectedExercise.position].reps}</span>
                                                        </div>
                                                    )}
                                                    {exerciseMeta[selectedExercise.position]?.sets && (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border shadow-sm rounded-lg">
                                                            <span className="text-accent-amber text-sm font-bold leading-none">🔄</span>
                                                            <span className="text-sm font-bold text-text-primary">{exerciseMeta[selectedExercise.position].sets}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Instructions */}
                                            {exerciseMeta[selectedExercise.position]?.instruction && (
                                                <div className="bg-bg-primary border border-border shadow-sm p-5 md:p-6 rounded-2xl">
                                                    <h3 className="text-[11px] sm:text-xs font-extrabold text-text-secondary flex items-center gap-2 uppercase tracking-widest mb-3">
                                                        <BookOpen size={16} className="text-accent-cyan" /> Technique
                                                    </h3>
                                                    <p className="text-text-primary text-[15px] leading-relaxed font-medium">
                                                        {exerciseMeta[selectedExercise.position].instruction}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Form Cues */}
                                            {exerciseMeta[selectedExercise.position]?.formCues && (
                                                <div className="bg-bg-secondary/40 border border-border p-5 md:p-6 rounded-2xl">
                                                    <h3 className="text-[11px] sm:text-xs font-extrabold text-text-secondary mb-3 uppercase tracking-widest">Clinical Form Cues</h3>
                                                    <ul className="space-y-3">
                                                        {exerciseMeta[selectedExercise.position].formCues.map((cue, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-[14px] sm:text-[15px] text-text-primary font-medium">
                                                                <span className="text-accent-cyan mt-[2px] sm:mt-[3px] font-bold bg-accent-cyan/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] sm:text-xs shadow-sm">✓</span>
                                                                <span className="leading-snug">{cue}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <div className="shrink-0 p-5 md:p-6 border-t border-border bg-bg-card">
                                            <button
                                                onClick={() => navigate('/routine', { 
                                                    state: { 
                                                        exercises: [selectedExercise], 
                                                        title: exerciseMeta[selectedExercise.position]?.name ?? selectedExercise.name 
                                                    } 
                                                })}
                                                className="w-full py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-extrabold rounded-2xl transition-all shadow-[0_4px_16px_rgba(0,229,204,0.2)] hover:shadow-[0_8px_24px_rgba(0,229,204,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base md:text-lg tracking-wide active:scale-95"
                                            >
                                                <Play size={20} fill="currentColor" /> Begin Form Practice
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
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
    { id: 1, title: "Maintain Posture", desc: "Keep spine aligned neutrally", fullDesc: "Keep your spine aligned neutrally throughout the day, whether sitting, standing, or walking, to avoid uneven strain on your discs.", img: rp1 },
    { id: 2, title: "Laptop Stand", desc: "Elevate screen to eye level", fullDesc: "Elevate your screen to eye level using a laptop stand. This prevents 'Screen Neck' and chronic cervical tension.", img: rp2 },
    { id: 3, title: "Reduce Stairs", desc: "Minimize climbing", fullDesc: "Minimize climbing stairs unnecessarily, especially if you already experience lower back pain, as it increases pressure on the lumbar discs.", img: rp3 },
    { id: 4, title: "Avoid Heavy Lifting", desc: "Protect your back", fullDesc: "Protect your back by avoiding heavy weights. If you must lift, always bend at the knees and keep the weight close to your body.", img: rp4 },
    { id: 5, title: "Waist Belt", desc: "Use support while traveling", fullDesc: "Use a lumbar support waist belt while traveling on bumpy roads or for long distances to prevent sudden jolts to your spine.", img: rp5 },
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

            {/* Clickable Image Grid (Overlay Text) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {PRECAUTION_ITEMS.map((item, i) => (
                    <button
                        key={item.id}
                        onClick={() => setOpenIndex(i)}
                        className="group relative aspect-[3/4] bg-bg-secondary border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/50 transition-all hover:scale-[1.02] active:scale-95 focus:outline-none text-left"
                    >
                        <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent z-10" />
                        {/* Label at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                            <p className="text-sm font-bold text-text-primary truncate">{item.title}</p>
                            <p className="text-[11px] text-text-secondary truncate mt-0.5">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Daily Spine Habits */}
            <div className="mt-8 bg-accent-cyan/5 border border-accent-cyan/20 rounded-radius-lg p-6 sm:p-8">
                <h3 className="text-xl font-display font-extrabold text-text-primary mb-5 flex items-center gap-2">
                    <span className="text-accent-cyan">✦</span> Daily Spine Habits
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="flex items-start gap-3 text-text-secondary">
                        <span className="text-accent-cyan bg-accent-cyan/10 p-1 rounded-full mt-0.5">✓</span>
                        <span>Don't sit for more than 45 minutes continuously unless absolutely necessary.</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <span className="text-accent-cyan bg-accent-cyan/10 p-1 rounded-full mt-0.5">✓</span>
                        <span>Maintain proper posture whether sitting, standing, or walking.</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <span className="text-accent-cyan bg-accent-cyan/10 p-1 rounded-full mt-0.5">✓</span>
                        <span>Drink plenty of water to keep your spinal discs hydrated and healthy.</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <span className="text-accent-cyan bg-accent-cyan/10 p-1 rounded-full mt-0.5">✓</span>
                        <span>Exercise for a minimum of 30 minutes every day to strengthen core muscles.</span>
                    </li>
                </ul>
            </div>

            {/* Exercise-style Top Anchored Lightbox */}
            <AnimatePresence>
                {openIndex !== null && (
                    <div className="fixed inset-0 z-[100] flex justify-center items-start pt-4 sm:pt-6 md:pt-10 px-4">
                        {/* Dimmed Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenIndex(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Card Content */}
                        <motion.div
                            initial={{ y: "-100%", opacity: 0.5 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.8 }}
                            className="relative w-full sm:max-w-3xl lg:max-w-4xl bg-bg-card rounded-3xl sm:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row border border-border z-10 overflow-hidden max-h-[90vh] sm:max-h-[85vh] mt-safe"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Image Header Block */}
                            <div className="w-full md:w-[45%] lg:w-2/5 relative bg-bg-secondary shrink-0 overflow-hidden flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border min-h-[220px]">
                                <img 
                                    src={PRECAUTION_ITEMS[openIndex].img} 
                                    alt={PRECAUTION_ITEMS[openIndex].title} 
                                    className="w-full h-full object-contain mix-blend-multiply relative z-10 max-h-[35vh]" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/10 to-transparent pointer-events-none" />
                                
                                {/* Mobile Close Button */}
                                <button
                                    onClick={() => setOpenIndex(null)}
                                    className="md:hidden absolute top-5 right-5 z-20 p-2.5 rounded-full bg-bg-card/90 backdrop-blur text-text-primary hover:bg-bg-primary shadow-lg border border-border flex items-center justify-center transition-transform active:scale-95"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Details Block */}
                            <div className="flex-1 flex flex-col overflow-hidden relative bg-bg-card">
                                {/* Desktop Close Button */}
                                <button
                                    onClick={() => setOpenIndex(null)}
                                    className="hidden md:flex absolute top-6 right-6 z-20 p-2.5 rounded-full bg-bg-secondary hover:bg-border text-text-secondary hover:text-text-primary transition-all items-center justify-center cursor-pointer active:scale-95"
                                >
                                    <X size={22} />
                                </button>

                                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 w-full">
                                    <div className="md:pr-14">
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-text-primary leading-tight tracking-tight mb-2">
                                            {PRECAUTION_ITEMS[openIndex].title}
                                        </h2>
                                        <p className="text-[13px] font-bold text-accent-cyan mb-4">{PRECAUTION_ITEMS[openIndex].desc}</p>
                                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed bg-bg-secondary/40 p-5 rounded-2xl border border-border">
                                            {PRECAUTION_ITEMS[openIndex].fullDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
