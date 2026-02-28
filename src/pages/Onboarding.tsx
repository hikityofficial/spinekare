import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, CheckCircle, Activity, Info } from 'lucide-react';
import {
    calculateSpineRisk,
    OPTION_TOOLTIPS,
    TIER_CONFIG,
    type RiskInput,
} from '../utils/riskEngine';

const questions: { id: keyof RiskInput; title: string; options: string[] }[] = [
    {
        id: 'ageGroup',
        title: 'How old are you?',
        options: ['Under 20', '20–35', '35–50', '50–65', '65+'],
    },
    {
        id: 'gender',
        title: 'What is your biological gender?',
        options: ['Male', 'Female', 'Other'],
    },
    {
        id: 'occupationType',
        title: 'What best describes your daily occupation?',
        options: ['Desk job (8+ hrs sitting)', 'Driver', 'Physical labor', 'Standing/retail', 'Student', 'Other'],
    },
    {
        id: 'isWeightlifter',
        title: 'Do you lift heavy weights regularly?',
        options: ['Gym', 'Construction', 'Both', 'No'],
    },
    {
        id: 'exerciseFrequency',
        title: 'How often do you exercise or move your body?',
        options: ['Never', '1–2x week', '3–5x week', 'Daily'],
    },
    {
        id: 'painLevel',
        title: 'Do you experience back or neck pain?',
        options: ['Never', 'Occasionally', 'Frequently', 'Chronic'],
    },
    {
        id: 'postureAwareness',
        title: 'How would you describe your posture?',
        options: ['I slouch constantly', 'Sometimes', 'I am conscious of it'],
    },
    {
        id: 'sleepPosition',
        title: 'What is your primary sleep position?',
        options: ['Stomach', 'Side', 'Back', 'Varies'],
    },
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<RiskInput>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
    const { updateProfile } = useAuth();
    const navigate = useNavigate();

    const handleSelect = (questionId: keyof RiskInput, option: string) => {
        const newAnswers = { ...answers, [questionId]: option } as Partial<RiskInput>;
        setAnswers(newAnswers);
        setTooltipVisible(null);

        if (step < questions.length - 1) {
            setTimeout(() => setStep(prev => prev + 1), 400);
        } else {
            setTimeout(() => runCalculation(newAnswers as RiskInput), 300);
        }
    };

    const runCalculation = (finalAnswers: RiskInput) => {
        setIsCalculating(true);

        setTimeout(async () => {
            try {
                const result = calculateSpineRisk(finalAnswers);

                await updateProfile({
                    gender:            finalAnswers.gender,
                    ageGroup:          finalAnswers.ageGroup,
                    occupationType:    finalAnswers.occupationType,
                    exerciseFrequency: finalAnswers.exerciseFrequency,
                    painLevel:         finalAnswers.painLevel,
                    postureAwareness:  finalAnswers.postureAwareness,
                    sleepPosition:     finalAnswers.sleepPosition,
                    spineRiskScore:    result.score,
                    riskTier:          result.category,
                    primaryReason:     result.primaryReason,
                    onboardingComplete: true,
                });
            } catch (err) {
                console.error('Critical error during analysis phase:', err);
            } finally {
                setIsCalculating(false);
                setStep(questions.length);
            }
        }, 1800);
    };

    if (step === questions.length) {
        return <ResultScreen onContinue={() => navigate('/dashboard')} />;
    }

    const currentQ = questions[step];
    const progress = ((step + 1) / questions.length) * 100;
    const tooltips = OPTION_TOOLTIPS[currentQ.id] || {};

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative">
            {/* Progress bar */}
            <div className="absolute top-8 w-full max-w-2xl px-6">
                <div className="flex justify-between text-xs text-text-secondary mb-2 font-bold tracking-widest uppercase">
                    <span>Spine Risk Profile</span>
                    <span>{step + 1} / {questions.length}</span>
                </div>
                <div className="h-1.5 w-full bg-bg-card rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-accent-cyan"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                {/* Step dots */}
                <div className="flex gap-1.5 mt-3 justify-center">
                    {questions.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i < step
                                ? 'bg-accent-cyan w-4'
                                : i === step
                                ? 'bg-accent-cyan w-6'
                                : 'bg-bg-card w-4'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full max-w-xl">
                <AnimatePresence mode="wait">
                    {isCalculating ? (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="relative w-24 h-24 mb-8">
                                <div className="absolute inset-0 border-4 border-bg-card rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                                <Activity className="absolute inset-0 m-auto text-accent-cyan" size={32} />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Analyzing your profile...</h2>
                            <p className="text-text-secondary text-center">Identifying mechanical stressors and compression risks.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-8 text-center leading-tight">
                                {currentQ.title}
                            </h2>

                            <div className="space-y-3">
                                {currentQ.options.map((option) => {
                                    const isSelected = answers[currentQ.id] === option;
                                    const tip = tooltips[option];
                                    const showTip = tooltipVisible === option;

                                    return (
                                        <div key={option} className="relative">
                                            <button
                                                onClick={() => handleSelect(currentQ.id, option)}
                                                className={`w-full text-left p-4 rounded-radius-lg border-2 transition-all flex items-center justify-between group ${isSelected
                                                    ? 'bg-accent-cyan/10 border-accent-cyan text-text-primary'
                                                    : 'bg-bg-card hover:bg-bg-secondary border-transparent hover:border-border text-text-secondary hover:text-text-primary'
                                                    }`}
                                            >
                                                <span className="text-base font-medium pr-2">{option}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {/* Tooltip trigger */}
                                                    {tip && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setTooltipVisible(showTip ? null : option);
                                                            }}
                                                            className="text-text-secondary hover:text-accent-cyan transition-colors"
                                                            aria-label="Why this matters"
                                                        >
                                                            <Info size={15} />
                                                        </button>
                                                    )}
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                                        ? 'border-accent-cyan bg-accent-cyan'
                                                        : 'border-border group-hover:border-text-secondary'
                                                        }`}>
                                                        {isSelected && <CheckCircle size={12} className="text-bg-primary" />}
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Educational tooltip */}
                                            <AnimatePresence>
                                                {showTip && tip && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="mt-1 mx-1 px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-xl text-xs text-text-secondary leading-relaxed"
                                                    >
                                                        <span className="font-bold text-accent-cyan mr-1">Why this matters:</span>
                                                        {tip}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => { setStep(prev => Math.max(0, prev - 1)); setTooltipVisible(null); }}
                                    disabled={step === 0}
                                    className={`flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                                >
                                    <ArrowLeft size={20} /> Back
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ onContinue }: { onContinue: () => void }) {
    const { user } = useAuth();
    if (!user) return null;

    const tier = (user.riskTier ?? 'low') as keyof typeof TIER_CONFIG;
    const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG.low;
    const score = user.spineRiskScore ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6"
        >
            <div className="w-full max-w-lg bg-bg-card border border-border p-8 rounded-radius-lg relative overflow-hidden">
                {/* Ambient glow */}
                <div className={`absolute top-0 right-0 w-72 h-72 blur-[90px] rounded-full opacity-20 ${cfg.glow}`} />

                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    {/* Badge */}
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-bg-secondary border border-border text-xs font-bold tracking-widest text-text-secondary uppercase">
                        Risk Assessment Complete
                    </div>

                    {/* Tier label */}
                    <p className={`text-xs font-bold tracking-widest uppercase ${cfg.color}`}>
                        {cfg.label}
                    </p>

                    {/* Score */}
                    <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-8xl font-display font-bold ${cfg.color}`}>
                            {score}
                        </span>
                        <span className="text-text-secondary font-bold text-xl">/100</span>
                    </div>

                    {/* Score bar */}
                    <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                            className={`h-full rounded-full ${tier === 'low'
                                ? 'bg-accent-green'
                                : tier === 'moderate'
                                ? 'bg-accent-amber'
                                : 'bg-accent-red'}`}
                        />
                    </div>

                    {/* Tier card */}
                    <div className={`w-full p-4 rounded-radius-lg border ${cfg.bg} text-left`}>
                        <h3 className={`text-lg font-bold mb-1 ${cfg.color}`}>{cfg.headline}</h3>
                        <p className="text-text-secondary text-sm">{cfg.subtext}</p>
                    </div>

                    {/* Primary reason */}
                    {user.primaryReason && (
                        <div className="w-full p-4 rounded-radius-lg border border-border bg-bg-primary text-left">
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Primary Risk Factor</p>
                            <p className="text-sm text-text-primary leading-relaxed">{user.primaryReason}</p>
                        </div>
                    )}

                    {/* CTA */}
                    <button
                        onClick={onContinue}
                        className="w-full py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-bold rounded-radius-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,229,204,0.2)]"
                    >
                        <span>Start My Spine Journey</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
