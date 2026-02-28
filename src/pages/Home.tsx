import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn, Activity, AlertTriangle, Heart, Users, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import logo from '../../assets/sslogo.png';
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

export default function Home() {
    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement | null>(null);
    const causesRef = useRef<HTMLDivElement | null>(null);

    // Popup State
    const [showPopup, setShowPopup] = useState(false);
    const [popupStep, setPopupStep] = useState(0);
    const [canContinue, setCanContinue] = useState(false);

    // Lightbox state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('spinekare_seen_intro_popup');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (showPopup) {
            setCanContinue(false);
            const timer = setTimeout(() => {
                setCanContinue(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showPopup, popupStep]);

    // Close lightbox on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight' && lightboxIndex !== null) setLightboxIndex(i => i !== null ? Math.min(i + 1, exerciseImages.length - 1) : null);
            if (e.key === 'ArrowLeft' && lightboxIndex !== null) setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIndex]);

    const handleNextStep = () => {
        if (popupStep < 3) {
            setPopupStep(prev => prev + 1);
        } else {
            localStorage.setItem('spinekare_seen_intro_popup', 'true');
            setShowPopup(false);
        }
    };

    const popupSlides = useMemo(() => [
        {
            icon: <Activity size={32} />,
            title: "Your Body's Pillar",
            text: "Your spine supports the entire weight of your upper body and head, enduring immense mechanical stress every single day."
        },
        {
            icon: <AlertTriangle size={32} />,
            title: "The Cost of Neglect",
            text: "Neglecting your spine can lead to herniated discs, chronic nerve pain, and a severely restricted range of motion over time."
        },
        {
            icon: <Heart size={32} />,
            title: "Why You Should Care",
            text: "Your spinal cord is the main highway for your central nervous system. A healthy spine means a healthy, active, and pain-free life."
        },
        {
            icon: <Users size={32} />,
            title: "You Are Not Alone",
            text: "Over 80% of adults will experience significant back pain in their lifetime, making it the leading cause of disability worldwide."
        }
    ], []);

    const exerciseImages = useMemo(
        () => [sse1, sse2, sse3, sse4, sse5, sse6, sse7, sse8, sse9, sse10, sse11, sse12],
        [],
    );

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,164,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(217,119,6,0.10),transparent_45%)]" />

            {/* Intro Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-bg-card border border-border shadow-[0_0_50px_rgba(0,229,204,0.15)] rounded-radius-lg max-w-lg w-full p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan via-accent-green to-accent-amber" />

                            <div className="flex justify-center gap-2 mb-6">
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === popupStep ? 'w-8 bg-accent-cyan' : 'w-2 bg-border'}`} />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={popupStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mx-auto w-16 h-16 rounded-full bg-accent-cyan/10 flex items-center justify-center mb-6 text-accent-cyan">
                                        {popupSlides[popupStep].icon}
                                    </div>
                                    <h2 className="text-3xl font-display font-extrabold text-text-primary mb-4">
                                        {popupSlides[popupStep].title}
                                    </h2>
                                    <p className="text-lg text-text-secondary leading-relaxed mb-8 min-h-[6rem] flex items-center justify-center">
                                        {popupSlides[popupStep].text}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <button
                                onClick={handleNextStep}
                                disabled={!canContinue}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-radius-lg bg-accent-cyan text-bg-primary font-bold hover:bg-accent-cyan-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg group relative overflow-hidden"
                            >
                                {canContinue ? (
                                    <>
                                        {popupStep < 3 ? "Continue" : "Enter SpineKare"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                ) : (
                                    <>
                                        <motion.div
                                            key={`progress-${popupStep}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 3, ease: "linear" }}
                                            className="absolute bottom-0 left-0 h-1 bg-black/20"
                                        />
                                        <span className="opacity-80">Please read...</span>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="relative max-w-2xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setLightboxIndex(null)}
                                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
                            >
                                <X size={20} /> Back
                            </button>

                            {/* Image */}
                            <img
                                src={exerciseImages[lightboxIndex]}
                                alt={`Exercise ${lightboxIndex + 1}`}
                                className="w-full rounded-radius-lg shadow-2xl border border-white/10"
                            />

                            {/* Label */}
                            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-sm font-extrabold border border-white/20">
                                Exercise {String(lightboxIndex + 1).padStart(2, '0')}
                            </div>

                            {/* Prev / Next */}
                            <button
                                onClick={() => setLightboxIndex(i => i !== null ? Math.max(i - 1, 0) : null)}
                                disabled={lightboxIndex === 0}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-30"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => setLightboxIndex(i => i !== null ? Math.min(i + 1, exerciseImages.length - 1) : null)}
                                disabled={lightboxIndex === exerciseImages.length - 1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-30"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top bar */}
            <header className="relative z-10 border-b border-border bg-bg-card/70 backdrop-blur">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="SpineKare" className="h-9 w-9 rounded-md object-contain bg-white" />
                        <div className="leading-tight">
                            <div className="font-display font-extrabold tracking-tight text-text-primary">SpineKare</div>
                            <div className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Medical-grade posture care</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => causesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-radius-lg bg-bg-secondary border border-border text-text-secondary text-sm font-bold hover:text-text-primary transition-colors"
                        >
                            <Play size={14} /> Causes & Videos
                        </button>
                        <button
                            onClick={() => navigate('/auth')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-radius-lg bg-accent-cyan text-bg-primary font-bold hover:bg-accent-cyan-dim transition-colors"
                        >
                            <LogIn size={18} /> Login / Sign up
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-border text-text-secondary text-xs font-bold tracking-widest uppercase">
                            Clinical wellness • Home routines
                        </div>
                        <h1 className="mt-5 text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-text-primary">
                            A light, professional spine-care companion.
                        </h1>
                        <p className="mt-4 text-lg text-text-secondary leading-relaxed max-w-xl">
                            Explore a preview of guided movements first. When you're ready, log in to get your plan, tracking, and 3D targeting.
                        </p>

                        <div className="mt-7 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => navigate('/auth')}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-radius-lg bg-text-primary text-bg-primary font-bold hover:bg-black/90 transition-colors"
                            >
                                Get started <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-radius-lg bg-bg-card border border-border text-text-primary font-bold hover:bg-bg-secondary transition-colors"
                            >
                                View exercise list
                            </button>
                            <button
                                onClick={() => causesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                className="sm:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-radius-lg bg-bg-card border border-border text-text-primary font-bold hover:bg-bg-secondary transition-colors"
                            >
                                <Play size={16} /> Causes & Videos
                            </button>
                        </div>
                    </div>

                    <div className="bg-bg-card border border-border rounded-radius-lg p-5 sm:p-6 shadow-[var(--shadow)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-bold tracking-widest uppercase text-text-secondary">Preview</div>
                                <div className="mt-1 text-2xl font-display font-extrabold text-text-primary">Exercise cards</div>
                                <div className="mt-1 text-sm text-text-secondary">Click any card to enlarge.</div>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {exerciseImages.slice(0, 6).map((src, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setLightboxIndex(idx)}
                                    className="relative aspect-square rounded-radius-md overflow-hidden border border-border bg-bg-secondary hover:border-accent-cyan/50 hover:scale-105 transition-all active:scale-95 focus:outline-none"
                                >
                                    <img src={src} alt={`Exercise ${idx + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-bg-card/85 backdrop-blur border border-border text-text-primary text-xs font-extrabold">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exercise list */}
                <section ref={listRef} className="mt-12 sm:mt-16">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div className="text-left">
                            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">Exercise list (preview)</h2>
                            <p className="mt-1 text-text-secondary">Click any card to see the image up close. Log in to start a routine.</p>
                        </div>
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-4 py-2.5 rounded-radius-lg bg-accent-cyan text-bg-primary font-bold hover:bg-accent-cyan-dim transition-colors"
                        >
                            Login to play
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {exerciseImages.map((src, idx) => (
                            <button
                                key={idx}
                                onClick={() => setLightboxIndex(idx)}
                                className="group bg-bg-card border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/40 transition-colors shadow-sm text-left focus:outline-none"
                            >
                                <div className="relative aspect-[4/3] bg-bg-secondary">
                                    <img src={src} alt={`Exercise ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-full bg-bg-card/90 backdrop-blur border border-border text-text-primary text-xs font-extrabold">
                                        Exercise {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>
                                <div className="p-3 text-xs text-text-secondary font-bold opacity-70">Tap to enlarge</div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Causes & Videos Section */}
                <section ref={causesRef} className="mt-16 sm:mt-20">
                    <div className="text-left mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-xs font-bold tracking-widest uppercase mb-3">
                            Why Spine Care Matters
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">Causes of Spine Issues</h2>
                        <p className="mt-2 text-text-secondary max-w-2xl">
                            Understanding the root causes helps you prevent and manage spine pain more effectively. Watch these short educational videos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[video1, video2].map((src, i) => (
                            <div key={i} className="bg-bg-card border border-border rounded-radius-lg overflow-hidden shadow-sm hover:border-accent-cyan/30 transition-colors">
                                <video
                                    src={src}
                                    controls
                                    className="w-full aspect-video bg-black"
                                    preload="metadata"
                                />
                                <div className="p-4">
                                    <p className="font-bold text-text-primary">
                                        {i === 0 ? 'Causes of Spinal Discomfort' : 'Posture & Lifestyle Factors'}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">
                                        {i === 0
                                            ? 'Learn what leads to common spine conditions and how to spot early warning signs.'
                                            : 'Discover how daily habits and posture directly impact your spinal health over time.'
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reasons and Precautions */}
                <section className="mt-16 sm:mt-20">
                    <div className="text-left mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-bold tracking-widest uppercase mb-3">
                            Know the Risks
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">Reasons and Precautions</h2>
                        <p className="mt-2 text-text-secondary max-w-2xl">
                            Understanding what causes spine problems and taking precautions helps you prevent issues before they start.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { id: 1, title: "Maintain Posture", desc: "Keep spine aligned neutrally", img: rp1 },
                            { id: 2, title: "Laptop Stand", desc: "Elevate screen to eye level", img: rp2 },
                            { id: 3, title: "Reduce Stairs", desc: "Minimize climbing to reduce disc pressure", img: rp3 },
                            { id: 4, title: "Avoid Heavy Lifting", desc: "Protect your back from heavy weights", img: rp4 },
                            { id: 5, title: "Waist Belt", desc: "Use support while traveling", img: rp5 },
                        ].map(item => (
                            <div
                                key={item.id}
                                className="group bg-bg-card border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/40 transition-all"
                            >
                                <div className="aspect-[4/3] bg-bg-secondary relative">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-text-primary text-sm mb-1">{item.title}</h3>
                                    <p className="text-xs text-text-secondary">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 bg-accent-cyan/5 border border-accent-cyan/20 rounded-radius-lg p-6 sm:p-8">
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
                </section>

                {/* Footer */}
                <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-text-secondary">
                    Made by{' '}
                    <a href="https://hikity.xyz" target="_blank" rel="noopener noreferrer" className="text-accent-cyan font-bold hover:underline">
                        Hikity
                    </a>
                </footer>
            </main>
        </div>
    );
}
