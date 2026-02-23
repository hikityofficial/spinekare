import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';

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

export default function Home() {
    const navigate = useNavigate();
    const listRef = useRef<HTMLDivElement | null>(null);

    const exerciseImages = useMemo(
        () => [sse1, sse2, sse3, sse4, sse5, sse6, sse7, sse8, sse9, sse10, sse11, sse12],
        [],
    );

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,164,0.12),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(217,119,6,0.10),transparent_45%)]" />

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

                    <button
                        onClick={() => navigate('/auth')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-radius-lg bg-accent-cyan text-bg-primary font-bold hover:bg-accent-cyan-dim transition-colors"
                    >
                        <LogIn size={18} /> Login / Sign up
                    </button>
                </div>
            </header>

            {/* Hero */}
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
                            Explore a preview of guided movements first. When you’re ready, log in to get your plan, tracking, and 3D targeting.
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
                        </div>
                    </div>

                    <div className="bg-bg-card border border-border rounded-radius-lg p-5 sm:p-6 shadow-[var(--shadow)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-bold tracking-widest uppercase text-text-secondary">Preview</div>
                                <div className="mt-1 text-2xl font-display font-extrabold text-text-primary">Exercise cards</div>
                                <div className="mt-1 text-sm text-text-secondary">Numbers only (no names) as requested.</div>
                            </div>
                            <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                                Light theme
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-3">
                            {exerciseImages.slice(0, 6).map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-radius-md overflow-hidden border border-border bg-bg-secondary">
                                    <img src={src} alt={`Exercise ${idx + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-bg-card/85 backdrop-blur border border-border text-text-primary text-xs font-extrabold">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exercise list */}
                <section ref={listRef} className="mt-12 sm:mt-16">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div className="text-left">
                            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">Exercise list (preview)</h2>
                            <p className="mt-1 text-text-secondary">Tap any card after login to start a routine.</p>
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
                            <div key={idx} className="group bg-bg-card border border-border rounded-radius-lg overflow-hidden hover:border-accent-cyan/40 transition-colors shadow-sm">
                                <div className="relative aspect-[4/3] bg-bg-secondary">
                                    <img src={src} alt={`Exercise ${idx + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-full bg-bg-card/90 backdrop-blur border border-border text-text-primary text-xs font-extrabold">
                                        Exercise {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="text-sm text-text-secondary">
                                        Numbered preview card
                                    </div>
                                    <div className="mt-2 h-10 rounded-radius-md bg-bg-secondary border border-border" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
