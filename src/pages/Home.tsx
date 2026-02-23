import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, HeartPulse, Bone, ArrowRight } from 'lucide-react';
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

const exerciseImages = [sse1, sse2, sse3, sse4, sse5, sse6, sse7, sse8, sse9, sse10, sse11, sse12];

export default function Home() {
    const navigate = useNavigate();

    const statCards = [
        { icon: <Activity className="text-accent-cyan" size={28} />, text: '80% of people will experience back pain in their lifetime.' },
        { icon: <ShieldAlert className="text-accent-red" size={28} />, text: 'Spinal disorders cost over $100B annually in the US.' },
        { icon: <HeartPulse className="text-accent-amber" size={28} />, text: 'Poor posture can reduce lung capacity by up to 30%.' },
        { icon: <Bone className="text-accent-cyan" size={28} />, text: 'Sedentary lifestyles increase disc degeneration risk significantly.' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            {/* Top navigation with logo */}
            <header className="w-full border-b border-border bg-bg-secondary/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="SpineKare Logo"
                            className="h-10 w-auto rounded-md border border-border bg-white object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text-secondary tracking-wide uppercase">
                                Digital Spine Health Platform
                            </span>
                            <span className="text-xl font-display font-bold tracking-tight">
                                <span className="text-accent-cyan">Spine</span>Kare
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/auth')}
                        className="px-4 py-2 rounded-full border border-border bg-bg-card text-sm font-semibold text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                    >
                        Log in / Sign up
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 w-full">
                <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10">
                    {/* Hero section */}
                    <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight"
                            >
                                Clinically structured exercises to protect your spine – before symptoms start.
                            </motion.h1>

                            <p className="text-text-secondary text-sm md:text-base max-w-xl">
                                Review the structured exercise set your patients will follow. Each movement is numbered and
                                visually guided to keep instructions simple and adherence high.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-radius-md bg-accent-cyan text-bg-primary font-semibold text-sm md:text-base shadow-sm hover:bg-accent-cyan-dim transition-colors"
                                >
                                    Start Spine Assessment
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        const gallery = document.getElementById('exercise-gallery');
                                        if (gallery) {
                                            gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-radius-md border border-border bg-bg-secondary text-sm md:text-base font-semibold text-text-primary hover:border-accent-cyan hover:text-accent-cyan transition-colors"
                                >
                                    View exercise list
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 bg-bg-secondary border border-border rounded-radius-lg p-5 md:p-6 shadow-sm">
                            <p className="text-xs font-semibold text-text-secondary uppercase tracking-[0.16em]">
                                Why proactive spine care
                            </p>
                            <div className="space-y-3">
                                {statCards.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 rounded-radius-md bg-bg-card/70 border border-border/60 px-3 py-3"
                                    >
                                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-bg-secondary border border-border">
                                            {stat.icon}
                                        </div>
                                        <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                                            {stat.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Exercise gallery */}
                    <section id="exercise-gallery" className="space-y-4 md:space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-display font-bold">
                                    Structured exercise list (12)
                                </h2>
                                <p className="text-text-secondary text-sm md:text-base max-w-2xl">
                                    Each exercise is referenced only by number and image to keep the programme simple and
                                    consistent for patients and clinicians.
                                </p>
                            </div>
                            <p className="text-xs md:text-sm text-text-secondary">
                                Designed for use on mobile, tablet, and desktop in clinical or at-home settings.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                            {exerciseImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col rounded-radius-md bg-bg-secondary border border-border overflow-hidden shadow-sm hover:border-accent-cyan/70 transition-colors"
                                >
                                    <div className="aspect-[4/3] w-full bg-bg-card/60 flex items-center justify-center">
                                        <img
                                            src={img}
                                            alt={`Exercise ${index + 1}`}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="px-3 py-2 flex items-center justify-between">
                                        <span className="inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-semibold">
                                            #{index + 1}
                                        </span>
                                        <span className="text-[11px] text-text-secondary uppercase tracking-[0.16em]">
                                            Exercise
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
