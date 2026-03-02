export type RiskTier = 'low' | 'moderate' | 'high' | 'critical';

export interface UserProfile {
    id: string;
    fullName?: string;
    gender?: string;
    ageGroup?: string;
    occupationType?: string;
    isWeightlifter?: boolean;
    exerciseFrequency?: string;
    painLevel?: string;
    postureAwareness?: string;
    sleepPosition?: string;
    spineRiskScore?: number;
    riskTier?: RiskTier;
    primaryReason?: string;
    onboardingComplete: boolean;
}

export interface Exercise {
    id: number;
    position: number;       // Sequential 1-based number after sorting by id (used for images & meta)
    name: string;
    description: string;
    targetArea: 'cervical' | 'thoracic' | 'lumbar' | 'core' | 'full';
    category: string;
    durationSeconds: number;
    reps?: string;
    animationUrl?: string;
    whatItDoes: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Routine {
    id: number;
    dayNumber: number;
    title: string;
    focusArea: string;
    estimatedMinutes: number;
    exercises: Exercise[];
}

export interface SpineFact {
    id: number;
    fact: string;
    category: string;
    dayNumber: number;
}

export interface UserStreak {
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string; // ISO date
    streakFreezes: number;
    totalPoints: number;
    weeklyPoints: number;    // points earned this ISO week (resets every Monday)
    weekNumber: number;       // ISO week number (1–53)
    weekYear: number;         // full year of that ISO week
}
