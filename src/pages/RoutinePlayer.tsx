import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import SpineModel3D from '../components/SpineModel3D';
import confetti from 'canvas-confetti';
import { Play, Pause, X, ChevronRight, Check, Info } from 'lucide-react';
import type { Exercise } from '../types';
import { getExerciseImage } from '../utils/exerciseImages';
import { exerciseMeta } from '../utils/exerciseMeta';
import { getTotalPoints } from '../utils/exercisePoints';

export default function RoutinePlayer() {
    const { todayRoutine, completeRoutine, addPoints } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Custom flow state
    const customExercises: Exercise[] = location.state?.exercises;
    const customTitle: string = location.state?.title || 'Custom Workout';
    const isCustomPlay = !!customExercises;

    const activeExercises = isCustomPlay ? customExercises : todayRoutine.exercises;
    const activeTitle = isCustomPlay ? customTitle : todayRoutine.title;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(isCustomPlay); // Auto-play if launched directly from library
    const [timeLeft, setTimeLeft] = useState(() => activeExercises[0]?.durationSeconds || 0);
    const [isResting, setIsResting] = useState(false);
    const [isPrepping, setIsPrepping] = useState(!isCustomPlay); // Skip prep screen if custom play
    const [isFinished, setIsFinished] = useState(false);
    const [cycleElapsed, setCycleElapsed] = useState(0); // seconds since exercise started

    const currentExercise = activeExercises[currentIndex];
    const restDuration = 15; // 15 seconds rest between exercises

    // Main countdown timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && !isPrepping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                setCycleElapsed(prev => prev + 1);
            }, 1000);
        } else if (isPlaying && !isPrepping && timeLeft === 0) {
            if (!isResting) {
                if (currentIndex < activeExercises.length - 1) {
                    setIsResting(true);
                    setTimeLeft(restDuration);
                } else {
                    handleFinish();
                }
            } else {
                setIsResting(false);
                setIsPrepping(true);
                setCurrentIndex(prev => prev + 1);
                setIsPlaying(false);
            }
        }
        return () => clearInterval(interval);
    }, [isPlaying, isPrepping, timeLeft, isResting, currentIndex, activeExercises]);

    // Handle Initial Start - No longer auto-starts for routines
    useEffect(() => {
        // Only assign initial time if it wasn't statically assigned in state
        if (currentExercise && isPrepping && currentIndex === 0 && !isFinished && timeLeft === 0) {
            setTimeLeft(currentExercise.durationSeconds);
            setIsPlaying(false);
        }
    }, [currentExercise, isPrepping, currentIndex, isFinished, timeLeft]);

    const startExercise = () => {
        setIsPrepping(false);
        setCycleElapsed(0);
        setTimeLeft(activeExercises[currentIndex].durationSeconds);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleSkip = () => {
        if (currentIndex < activeExercises.length - 1) {
            setIsResting(false);
            setIsPrepping(true);
            setCurrentIndex(prev => prev + 1);
            setIsPlaying(false);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        setIsFinished(true);
        setIsPlaying(false);

        if (isCustomPlay) {
            // Award points based on exercise position numbers (1-12), not raw DB IDs
            const exercisePositions = activeExercises.map(ex => ex.position);
            const pts = getTotalPoints(exercisePositions);
            addPoints(pts);
        } else {
            completeRoutine();
        }

        // Fire confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#00E5CC', '#2ED573']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#00E5CC', '#2ED573']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const quitRoutine = () => {
        if (window.confirm("Are you sure you want to quit? Your progress won't be saved.")) {
            navigate('/dashboard');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Progress calculations
    const totalDuration = isResting ? restDuration : currentExercise?.durationSeconds || 1;
    const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

    const pointsEarned = isCustomPlay
        ? getTotalPoints(activeExercises.map(ex => ex.position))
        : getTotalPoints(todayRoutine.exercises.map(ex => ex.position));

    if (isFinished) {
        return (
            <div className="fixed inset-0 bg-bg-primary z-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-accent-green/5 blur-[100px] rounded-full flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 opacity-30">
                        <SpineModel3D activeArea="full" />
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center mb-6 border-2 border-accent-green shadow-[0_0_50px_rgba(46,213,115,0.4)]">
                        <Check size={48} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                        {isCustomPlay ? "Workout Complete!" : "Routine Complete!"}
                    </h1>
                    <p className="text-xl text-text-secondary mb-8">
                        You earned <span className="text-accent-cyan font-bold">+{pointsEarned} Points</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto px-8 py-4 bg-bg-card hover:bg-bg-secondary border border-border rounded-radius-lg font-bold transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="w-full sm:w-auto px-8 py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary rounded-radius-lg font-bold transition-colors shadow-[0_0_20px_rgba(0,229,204,0.3)]"
                        >
                            View Leaderboard
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!currentExercise) return null;

    const exerciseLabel = `Exercise ${currentIndex + 1} of ${activeExercises.length}`;

    return (
        <div className="fixed inset-0 bg-bg-primary z-50 flex flex-col md:flex-row overflow-hidden">
            {/* Top Bar (Mobile) / Close Button */}
            <div className="absolute top-0 right-0 p-6 z-50">
                <button onClick={quitRoutine} className="p-3 bg-bg-secondary/50 hover:bg-bg-card rounded-full text-text-secondary hover:text-text-primary transition-colors backdrop-blur-md">
                    <X size={24} />
                </button>
            </div>

            {/* Left Side: Spine Visualizer (Hidden on small mobile) */}
            <div className="hidden md:flex flex-1 bg-bg-secondary border-r border-border relative flex-col justify-center items-center overflow-hidden h-full">
                <div className="absolute top-8 text-center w-full z-10 px-8">
                    <h2 className="text-xl font-display font-bold text-text-primary tracking-wide">
                        {activeTitle}
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">{exerciseLabel}</p>
                </div>

                <div className="w-full h-full max-h-[80vh] relative z-0 flex items-center justify-center p-8">
                    {!isResting ? (
                        <img
                            src={getExerciseImage(currentExercise.position)}
                            alt={currentExercise.name}
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    ) : (
                        <SpineModel3D activeArea="none" />
                    )}
                </div>

                {/* Target highlight label */}
                {!isResting && (
                    <div className="absolute bottom-12 bg-bg-primary/80 backdrop-blur px-6 py-3 rounded-full border border-accent-cyan/30 text-accent-cyan font-bold tracking-widest uppercase text-sm">
                        {exerciseMeta[currentExercise.position]?.targetArea ?? `${currentExercise.targetArea} spine`}
                    </div>
                )}
            </div>

            {/* Right Side: Exercise Controls */}
            <div className="flex-1 flex flex-col justify-center p-6 md:p-12 h-full w-full relative overflow-y-auto">
                {/* Mobile exercise image — hidden on desktop where left panel shows it */}
                {!isResting && (
                    <div className="md:hidden w-full max-w-xs mx-auto mb-6 mt-12">
                        <img
                            src={getExerciseImage(currentExercise.position)}
                            alt={currentExercise.name}
                            className="w-full h-auto object-contain rounded-xl border border-border shadow-sm"
                        />
                        <p className="text-center text-xs text-accent-cyan font-bold mt-2 uppercase tracking-widest">
                            Targeting: {currentExercise.targetArea} spine
                        </p>
                    </div>
                )}
                <div className="w-full max-w-lg mx-auto">

                    <AnimatePresence mode="wait">
                        {isPrepping ? (
                            <motion.div
                                key="prep"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex flex-col items-center md:items-start text-center md:text-left"
                            >
                                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-bold tracking-widest text-accent-cyan uppercase mb-4">
                                    Next: {currentExercise.category}
                                </div>

                                <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
                                    {exerciseMeta[currentExercise.position]?.name ?? currentExercise.name}
                                </h2>

                                <div className="w-full bg-bg-secondary rounded-radius-lg border border-border p-6 mb-8 flex flex-col items-center">
                                    <div className="w-48 h-48 mb-6 relative flex items-center justify-center overflow-hidden rounded-xl bg-bg-primary border border-border">
                                        <div className="absolute inset-0 bg-accent-cyan/5"></div>
                                        <SpineModel3D activeArea={currentExercise.targetArea} />
                                    </div>

                                    <div className="w-full text-left space-y-4">
                                        {/* Duration, Reps & Sets badges */}
                                        <div className="flex flex-wrap gap-3">
                                            {exerciseMeta[currentExercise.position]?.duration && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-bold">
                                                    ⏱ {exerciseMeta[currentExercise.position].duration}
                                                </div>
                                            )}
                                            {exerciseMeta[currentExercise.position]?.reps && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-bold">
                                                    🔁 {exerciseMeta[currentExercise.position].reps}
                                                </div>
                                            )}
                                            {exerciseMeta[currentExercise.position]?.sets && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-xs font-bold">
                                                    🔄 {exerciseMeta[currentExercise.position].sets}
                                                </div>
                                            )}
                                        </div>

                                        {/* Age Restriction Warning */}
                                        {exerciseMeta[currentExercise.position]?.ageRestriction && (
                                            <div className="flex items-start gap-3 bg-accent-red/10 p-4 rounded-radius-md border border-accent-red/30">
                                                <span className="text-lg shrink-0">⚠️</span>
                                                <p className="text-accent-red text-sm font-bold">
                                                    {exerciseMeta[currentExercise.position].ageRestriction}
                                                </p>
                                            </div>
                                        )}

                                        {/* Instruction */}
                                        {exerciseMeta[currentExercise.position]?.instruction && (
                                            <div className="bg-bg-primary p-4 rounded-radius-md border border-border">
                                                <p className="text-sm font-bold text-text-primary mb-2">How To Perform</p>
                                                <p className="text-text-secondary text-sm leading-relaxed">
                                                    {exerciseMeta[currentExercise.position].instruction}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3 bg-bg-primary p-4 rounded-radius-md border border-border">
                                            <Info className="text-accent-cyan mt-0.5 shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm font-bold text-text-primary mb-1">Surface Needed</p>
                                                <p className="text-text-secondary text-sm">
                                                    {exerciseMeta[currentExercise.position]?.surface || "Comfortable surface"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-bg-primary p-4 rounded-radius-md border border-border">
                                            <p className="text-sm font-bold text-text-primary mb-3">Form Cues</p>
                                            <ul className="text-sm text-text-secondary space-y-2 list-disc pl-5">
                                                {(exerciseMeta[currentExercise.position]?.formCues || [currentExercise.whatItDoes]).map((cue, i) => (
                                                    <li key={i}>{cue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={startExercise}
                                    className="w-full py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary font-bold rounded-radius-lg transition-all shadow-[0_0_20px_rgba(0,229,204,0.3)] text-lg flex items-center justify-center gap-2"
                                >
                                    I'm Ready <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        ) : !isResting ? (
                            <motion.div
                                key="exercise"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="flex flex-col items-center md:items-start text-center md:text-left w-full"
                            >
                                {/* Header: Spine Model + Title */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 w-full">
                                    <div className="w-20 h-20 shrink-0 bg-bg-secondary rounded-xl border border-border flex items-center justify-center relative overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 bg-accent-cyan/5"></div>
                                        <SpineModel3D activeArea={currentExercise.targetArea} />
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-accent-cyan/10 text-[10px] font-bold tracking-widest text-accent-cyan uppercase mb-1">
                                            {exerciseMeta[currentExercise.position]?.targetArea ?? currentExercise.category}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary leading-tight">
                                            {exerciseMeta[currentExercise.position]?.name ?? currentExercise.name}
                                        </h2>
                                    </div>
                                </div>

                                {/* Phase Prompt — cycles per reps rhythm */}
                                {(() => {
                                    const reps = exerciseMeta[currentExercise.position]?.reps ?? '';
                                    let prompt = '';
                                    let promptColor = 'text-accent-cyan';

                                    if (reps.includes('10 sec arch')) {
                                        // Ex 1 & 2: 10s arch → 5s straight
                                        const phase = cycleElapsed % 15;
                                        if (phase < 10) {
                                            prompt = `🔽 ARCH — hold ${10 - phase}s`;
                                            promptColor = 'text-accent-amber';
                                        } else {
                                            prompt = `🟢 STRAIGHT — hold ${15 - phase}s`;
                                            promptColor = 'text-accent-green';
                                        }
                                    } else if (reps.includes('8 sec') && reps.includes('each leg')) {
                                        // Alternating legs: 8s left, 8s right
                                        const phase = cycleElapsed % 16;
                                        if (phase < 8) {
                                            prompt = `📍 LEFT LEG — ${8 - phase}s`;
                                            promptColor = 'text-accent-cyan';
                                        } else {
                                            prompt = `📍 RIGHT LEG — ${16 - phase}s`;
                                            promptColor = 'text-accent-amber';
                                        }
                                    } else if (reps.includes('8 sec') && reps.includes('each side')) {
                                        // Alternating sides: 8s left, 8s right
                                        const phase = cycleElapsed % 16;
                                        if (phase < 8) {
                                            prompt = `➡️ LEFT SIDE — ${8 - phase}s`;
                                            promptColor = 'text-accent-cyan';
                                        } else {
                                            prompt = `➡️ RIGHT SIDE — ${16 - phase}s`;
                                            promptColor = 'text-accent-amber';
                                        }
                                    } else if (reps.includes('3 sets') && reps.includes('25 sec')) {
                                        // Ex 8: 3×25s + 15s rest
                                        const cycleLen = 40; // 25s hold + 15s rest
                                        const phase = cycleElapsed % cycleLen;
                                        const setNum = Math.floor(cycleElapsed / cycleLen) + 1;
                                        if (phase < 25) {
                                            prompt = `SET ${Math.min(setNum, 3)}/3 — hold ${25 - phase}s`;
                                            promptColor = 'text-accent-amber';
                                        } else {
                                            prompt = `🏳️ REST — next set in ${cycleLen - phase}s`;
                                            promptColor = 'text-text-secondary';
                                        }
                                    } else if (reps.includes('4 sets') && reps.includes('20 sec')) {
                                        // Ex 11: 4×20s + 10s rest
                                        const cycleLen = 30; // 20s hold + 10s rest
                                        const phase = cycleElapsed % cycleLen;
                                        const setNum = Math.floor(cycleElapsed / cycleLen) + 1;
                                        if (phase < 20) {
                                            prompt = `SET ${Math.min(setNum, 4)}/4 — hold ${20 - phase}s`;
                                            promptColor = 'text-accent-amber';
                                        } else {
                                            prompt = `🏳️ REST — next set in ${cycleLen - phase}s`;
                                            promptColor = 'text-text-secondary';
                                        }
                                    } else if (reps.includes('10 seconds') && reps.includes('once per day')) {
                                        prompt = `HOLD — ${Math.max(0, 10 - cycleElapsed)}s remaining`;
                                        promptColor = 'text-accent-cyan';
                                    } else {
                                        prompt = 'Keep going — breathe steadily 💪';
                                        promptColor = 'text-accent-green';
                                    }

                                    return (
                                        <div className={`w-full text-center mb-4 px-4 py-3 rounded-radius-lg bg-bg-card border border-border`}>
                                            <p className={`text-lg font-extrabold font-display tracking-wide ${promptColor}`}>{prompt}</p>
                                        </div>
                                    );
                                })()}

                                {/* Timer Circle */}
                                <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="6" className="text-bg-secondary" />
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            fill="none" stroke="currentColor" strokeWidth="6"
                                            strokeDasharray="300"
                                            strokeDashoffset={300 - (300 * progressPercent) / 100}
                                            className="text-accent-cyan drop-shadow-[0_0_12px_rgba(0,229,204,0.6)] transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <div className="text-5xl md:text-6xl font-display font-bold text-text-primary tracking-tighter tabular-nums">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-6 justify-center w-full mb-6">
                                    <button
                                        onClick={togglePlay}
                                        className="w-16 h-16 bg-accent-cyan text-bg-primary rounded-full flex items-center justify-center hover:bg-accent-cyan-dim transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,229,204,0.4)]"
                                    >
                                        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                                    </button>
                                    <button
                                        onClick={handleSkip}
                                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold px-4 py-2 rounded-full hover:bg-bg-secondary transition-colors"
                                    >
                                        Skip <ChevronRight size={20} />
                                    </button>
                                </div>

                                {/* Live Instructions panel */}
                                <div className="w-full bg-bg-card border border-border rounded-radius-lg p-4 space-y-4">
                                    {/* Instruction */}
                                    {exerciseMeta[currentExercise.position]?.instruction && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">How To Perform</p>
                                            <p className="text-sm text-text-primary leading-relaxed">
                                                {exerciseMeta[currentExercise.position].instruction}
                                            </p>
                                        </div>
                                    )}
                                    {/* Form Cues */}
                                    {exerciseMeta[currentExercise.position]?.formCues?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Form Cues</p>
                                            <ul className="space-y-1.5">
                                                {exerciseMeta[currentExercise.position].formCues.map((cue, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                        <span className="text-accent-cyan mt-0.5 shrink-0">›</span>
                                                        {cue}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Surface Needed */}
                                    {exerciseMeta[currentExercise.position]?.surface && (
                                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                                            <Info size={13} className="text-accent-cyan shrink-0" />
                                            <p className="text-xs text-text-secondary">
                                                <span className="font-bold text-text-primary">Surface: </span>
                                                {exerciseMeta[currentExercise.position].surface}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </motion.div>
                        ) : (
                            <motion.div
                                key="rest"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex flex-col items-center justify-center h-full text-center"
                            >
                                <h2 className="text-3xl font-display font-bold text-accent-amber mb-2">Rest & Prepare</h2>
                                <p className="text-text-secondary mb-12">
                                    Up next: <span className="text-text-primary font-bold">Exercise {String(currentIndex + 2).padStart(2, '0')}</span>
                                </p>

                                <div className="text-7xl font-display font-bold text-text-primary mb-12 tabular-nums">
                                    {timeLeft}s
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { setTimeLeft(0); }} // Skip rest
                                        className="px-8 py-3 bg-bg-card border border-border hover:bg-bg-secondary rounded-full font-bold transition-colors"
                                    >
                                        Skip Rest
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

        </div>
    );
}
