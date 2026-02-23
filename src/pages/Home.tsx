import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, ShieldAlert, HeartPulse, Bone } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const seen = localStorage.getItem('onboardingSeen');
        if (!seen) {
            setShowModal(true);
        } else {
            // If they already saw it, just redirect to auth
            navigate('/auth');
        }
    }, [navigate]);

    useEffect(() => {
        if (showModal && step < 4) {
            const timer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [showModal, step]);

    const handleStart = () => {
        localStorage.setItem('onboardingSeen', 'true');
        setShowModal(false);
        navigate('/auth');
    };

    const statCards = [
        { icon: <Activity className="text-accent-cyan" size={32} />, text: "80% of people will experience back pain in their lifetime" },
        { icon: <ShieldAlert className="text-accent-red" size={32} />, text: "Spinal disorders cost $100B+ annually in the US" },
        { icon: <HeartPulse className="text-accent-amber" size={32} />, text: "Poor posture reduces lung capacity by up to 30%" },
        { icon: <Bone className="text-accent-cyan" size={32} />, text: "Sitting 6+ hours/day increases disc degeneration risk by 40%" },
    ];

    if (!showModal) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-bg-primary flex flex-col items-center justify-center p-6 z-50 overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-amber/5 blur-[100px] rounded-full"></div>

            <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-4xl md:text-5xl font-display font-bold text-center text-accent-red mb-12 shadow-sm"
                >
                    Your Spine Is Silently Suffering
                </motion.h1>

                <div className="w-full space-y-4 mb-12">
                    <AnimatePresence>
                        {statCards.map((stat, i) => (
                            i <= step && (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="bg-bg-card border border-border p-4 rounded-radius overflow-hidden flex items-center gap-4 relative"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan/50"></div>
                                    <div className="flex-shrink-0 bg-bg-secondary p-3 rounded-radius-sm">
                                        {stat.icon}
                                    </div>
                                    <p className="text-text-primary md:text-lg font-body">{stat.text}</p>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {step >= 4 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-sm"
                        >
                            <p className="text-center text-text-secondary mb-6 tracking-wide uppercase text-sm font-semibold">
                                Most damage starts silently — before you feel anything.
                            </p>

                            <button
                                onClick={handleStart}
                                className="w-full py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-bold rounded-radius-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(0,229,204,0.3)] hover:shadow-[0_0_40px_rgba(0,229,204,0.5)]"
                            >
                                <span>Take Care of My Spine</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
