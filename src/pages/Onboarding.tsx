import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ArrowLeft, CheckCircle, Activity } from 'lucide-react';

const questions = [
    { id: 'ageGroup', title: 'How old are you?', options: ['Under 20', '20–35', '35–50', '50–65', '65+'] },
    { id: 'occupationType', title: 'What best describes your daily occupation?', options: ['Desk job (8+ hrs sitting)', 'Standing/retail', 'Physical labor', 'Driver', 'Student', 'Other'] },
    { id: 'isWeightlifter', title: 'Do you lift heavy weights?', options: ['Gym', 'Construction', 'Both', 'No'] },
    { id: 'exerciseFrequency', title: 'Do you exercise regularly?', options: ['Never', '1–2x week', '3–5x week', 'Daily'] },
    { id: 'painLevel', title: 'Do you experience back or neck pain?', options: ['Never', 'Occasionally', 'Frequently', 'Chronic'] },
    { id: 'postureAwareness', title: 'How is your posture awareness?', options: ['I slouch constantly', 'Sometimes', 'I am conscious of it'] },
    { id: 'sleepPosition', title: 'What is your primary sleep position?', options: ['Stomach', 'Side', 'Back', 'Varies'] },
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const { updateProfile } = useAuth();
    const navigate = useNavigate();

    const handleSelect = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));

        // Auto advance after 400ms
        if (step < questions.length - 1) {
            setTimeout(() => setStep(prev => prev + 1), 400);
        } else {
            calculateRisk();
        }
    };

    const calculateRisk = () => {
        setIsCalculating(true);

        setTimeout(async () => {
            // Mock calculation
            // Using tier directly. Real app would aggregate score.
            const tier = 'moderate';
            await updateProfile({
                ...answers,
                spineRiskScore: 65,
                riskTier: tier,
                onboardingComplete: true
            });

            setIsCalculating(false);
            setStep(questions.length); // go to results screen
        }, 2000);
    };

    if (step === questions.length) {
        // Show results
        return <ResultScreen onContinue={() => navigate('/dashboard')} />;
    }

    const currentQ = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-12 w-full max-w-2xl px-6">
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
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-8 text-center leading-tight">
                                {currentQ.title}
                            </h2>

                            <div className="space-y-3">
                                {currentQ.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(currentQ.id, option)}
                                        className={`w-full text-left p-5 rounded-radius-lg border-2 transition-all flex items-center justify-between group ${answers[currentQ.id] === option
                                            ? 'bg-accent-cyan/10 border-accent-cyan text-text-primary'
                                            : 'bg-bg-card hover:bg-bg-secondary border-transparent hover:border-border text-text-secondary hover:text-text-primary'
                                            }`}
                                    >
                                        <span className="text-lg font-medium">{option}</span>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQ.id] === option ? 'border-accent-cyan bg-accent-cyan' : 'border-border group-hover:border-text-secondary'
                                            }`}>
                                            {answers[currentQ.id] === option && <CheckCircle size={14} className="text-bg-primary" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(prev => Math.max(0, prev - 1))}
                                    disabled={step === 0}
                                    className={`flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                                >
                                    <ArrowLeft size={20} /> Back
                                </button>
                            </div>
                        </motion.div >
                    )}
                </AnimatePresence >
            </div >
        </div >
    );
}

function ResultScreen({ onContinue }: { onContinue: () => void }) {
    const { user } = useAuth();
    if (!user) return null;

    const getTierColor = (tier?: string) => {
        if (tier === 'low') return 'text-accent-green';
        if (tier === 'moderate') return 'text-accent-amber';
        return 'text-accent-red';
    };

    const getTierBg = (tier?: string) => {
        if (tier === 'low') return 'bg-accent-green/10 border-accent-green/30';
        if (tier === 'moderate') return 'bg-accent-amber/10 border-accent-amber/30';
        return 'bg-accent-red/10 border-accent-red/30';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6"
        >
            <div className="w-full max-w-lg bg-bg-card border border-border p-8 rounded-radius-lg relative overflow-hidden">
                {/* Glow behind card */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 ${user.riskTier === 'low' ? 'bg-accent-green' : user.riskTier === 'moderate' ? 'bg-accent-amber' : 'bg-accent-red'
                    }`}></div>

                <div className="relative z-10 text-center flex flex-col items-center">
                    <div className="mb-4 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-bg-secondary border border-border text-sm font-bold tracking-widest text-text-secondary uppercase">
                        Risk Assessment Complete
                    </div>

                    <p className="text-text-secondary mb-2">Your Spine Risk Score</p>
                    <div className="flex items-baseline justify-center gap-1 mb-6">
                        <span className={`text-7xl font-display font-bold ${getTierColor(user.riskTier)}`}>
                            {user.spineRiskScore}
                        </span>
                        <span className="text-text-secondary font-bold">/100</span>
                    </div>

                    <div className={`w-full p-4 rounded-radius-lg border ${getTierBg(user.riskTier)} mb-8 text-center`}>
                        <h3 className={`text-xl font-bold mb-1 ${getTierColor(user.riskTier)}`}>
                            {user.riskTier === 'low' && 'Great baseline!'}
                            {user.riskTier === 'moderate' && 'Warning signs detected.'}
                            {user.riskTier === 'high' && 'Urgent daily attention needed.'}
                        </h3>
                        <p className="text-text-secondary text-sm">
                            {user.riskTier === 'low' && "Let's keep it that way through maintenance."}
                            {user.riskTier === 'moderate' && "You're developing habits that cause compression. Act now."}
                            {user.riskTier === 'high' && "Your lifestyle puts severe stress on your lower back and neck."}
                        </p>
                    </div >

                    <button
                        onClick={onContinue}
                        className="w-full py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-bold rounded-radius-lg transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,229,204,0.2)]"
                    >
                        <span>Start My Spine Journey</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div >
            </div >
        </motion.div >
    );
}
