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
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [isPrepping, setIsPrepping] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    const currentExercise = activeExercises[currentIndex];
    const restDuration = 15; // 15 seconds rest between exercises

    // Timer logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && !isPrepping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isPlaying && !isPrepping && timeLeft === 0) {
            // Time is up! 
            if (!isResting) {
                // Exercise finished, go to rest or next
                if (currentIndex < activeExercises.length - 1) {
                    setIsResting(true);
                    setTimeLeft(restDuration);
                } else {
                    // Routine finished
                    handleFinish();
                }
            } else {
                // Rest finished, start next exercise prep
                setIsResting(false);
                setIsPrepping(true);
                setCurrentIndex(prev => prev + 1);
                setIsPlaying(false);
            }
        }
        return () => clearInterval(interval);
    }, [isPlaying, isPrepping, timeLeft, isResting, currentIndex, activeExercises]);

    // Handle Initial Start - No longer auto-starts
    useEffect(() => {
        if (currentExercise && isPrepping && currentIndex === 0 && !isFinished) {
            setTimeLeft(currentExercise.durationSeconds);
            setIsPlaying(false);
        }
    }, [currentExercise, isPrepping, currentIndex, isFinished]);

    const startExercise = () => {
        setIsPrepping(false);
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
            addPoints(activeExercises.length * 50); // 50 points per exercise config
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

    const pointsEarned = isCustomPlay ? activeExercises.length * 50 : 100;

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

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 bg-bg-card hover:bg-bg-secondary border border-border rounded-radius-lg font-bold transition-colors"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="px-8 py-4 bg-accent-cyan hover:bg-accent-cyan-dim text-bg-primary rounded-radius-lg font-bold transition-colors shadow-[0_0_20px_rgba(0,229,204,0.3)]"
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
                    {!isResting && !isPrepping ? (
                        <img
                            src={getExerciseImage(currentExercise.id)}
                            alt={currentExercise.name}
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    ) : (
                        <SpineModel3D activeArea={isResting ? 'none' : currentExercise.targetArea} />
                    )}
                </div>

                {/* Target highlight label */}
                {(!isResting && isPrepping) && (
                    <div className="absolute bottom-12 bg-bg-primary/80 backdrop-blur px-6 py-3 rounded-full border border-accent-cyan/30 text-accent-cyan font-bold tracking-widest uppercase text-sm">
                        Targeting: {currentExercise.targetArea} spine
                    </div>
                )}
            </div>

            {/* Right Side: Exercise Controls */}
            <div className="flex-1 flex flex-col justify-center p-6 md:p-12 h-full w-full relative">
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

                                <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
                                    {currentExercise.name}
                                </h2>

                                <div className="w-full bg-bg-secondary rounded-radius-lg border border-border p-6 mb-8 flex flex-col items-center">
                                    <img
                                        src={getExerciseImage(currentExercise.id)}
                                        alt={currentExercise.name}
                                        className="w-48 h-48 object-contain mb-6 drop-shadow-xl"
                                    />

                                    <div className="w-full text-left space-y-4">
                                        <div className="flex items-start gap-3 bg-bg-primary p-4 rounded-radius-md border border-border">
                                            <Info className="text-accent-cyan mt-0.5 shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm font-bold text-text-primary mb-1">Surface Needed</p>
                                                <p className="text-text-secondary text-sm">
                                                    {exerciseMeta[currentExercise.id]?.surface || "Comfortable surface"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-bg-primary p-4 rounded-radius-md border border-border">
                                            <p className="text-sm font-bold text-text-primary mb-3">Form Cues</p>
                                            <ul className="text-sm text-text-secondary space-y-2 list-disc pl-5">
                                                {(exerciseMeta[currentExercise.id]?.formCues || [currentExercise.whatItDoes]).map((cue, i) => (
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
                                {/* Header with Spine Model & Title */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 w-full">
                                    <div className="w-24 h-24 shrink-0 bg-bg-secondary rounded-xl border border-border flex items-center justify-center relative overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 bg-accent-cyan/5"></div>
                                        <SpineModel3D activeArea={currentExercise.targetArea} />
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-accent-cyan/10 text-[10px] font-bold tracking-widest text-accent-cyan uppercase mb-2">
                                            {currentExercise.category}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary leading-tight">
                                            {currentExercise.name}
                                        </h2>
                                    </div>
                                </div>

                                {/* Timer Circle */}
                                <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                                    {/* Background Ring */}
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            fill="none" stroke="currentColor" strokeWidth="6"
                                            className="text-bg-secondary"
                                        />
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            fill="none" stroke="currentColor" strokeWidth="6"
                                            strokeDasharray="300"
                                            strokeDashoffset={300 - (300 * progressPercent) / 100}
                                            className="text-accent-cyan drop-shadow-[0_0_12px_rgba(0,229,204,0.6)] transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <div className="text-6xl md:text-7xl font-display font-bold text-text-primary tracking-tighter tabular-nums">
                                        {formatTime(timeLeft)}
                                    </div>
                                </div>

                                {/* Form Tip Reminder */}
                                <div className="w-full text-center mb-8">
                                    <p className="text-text-secondary italic">
                                        Tip: {exerciseMeta[currentExercise.id]?.formCues[0] || currentExercise.whatItDoes}
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-6 justify-center w-full">
                                    <button
                                        onClick={togglePlay}
                                        className="w-20 h-20 bg-accent-cyan text-bg-primary rounded-full flex items-center justify-center hover:bg-accent-cyan-dim transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,229,204,0.4)]"
                                    >
                                        {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
                                    </button>
                                    <button
                                        onClick={handleSkip}
                                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-bold px-4 py-2 rounded-full hover:bg-bg-secondary transition-colors absolute right-0 bottom-0 md:relative"
                                    >
                                        Skip <ChevronRight size={20} />
                                    </button>
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
