/**
 * SpineKare Risk Engine v2
 * Calculates a Spine Issue Risk Score (0–100) with 4-tier categorization.
 */

export interface RiskInput {
    ageGroup: string;
    gender: string;
    occupationType: string;
    isWeightlifter: string;
    exerciseFrequency: string;
    painLevel: string;
    postureAwareness: string;
    sleepPosition: string;
}

export type RiskCategory = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskResult {
    score: number;
    category: RiskCategory;
    /** One-sentence explanation of the single highest contributing factor */
    primaryReason: string;
    /** Detailed breakdown of points per factor */
    breakdown: Record<string, number>;
}

// ─── Tooltip reasons shown during the quiz ───────────────────────────────────
export const OPTION_TOOLTIPS: Record<string, Record<string, string>> = {
    ageGroup: {
        'Under 35':  'Younger spines are more resilient and recover faster.',
        '35–50':     'Disc degeneration accelerates significantly after 35.',
        '50–65':     'Bone density starts declining; facet joints wear down.',
        '65+':       'Highest risk of stenosis, osteoporosis, and compression fractures.',
    },
    gender: {
        'Female':   'Women face higher risk of osteoporosis and hormonal bone-density loss.',
        'Male':     'Standard baseline — slightly lower osteoporosis risk.',
        'Other':    'Standard baseline risk.',
    },
    occupationType: {
        'Desk job (8+ hrs sitting)': 'Sitting 8+ hours activates Lower Crossed Syndrome — the #1 modern spine killer.',
        'Driver':                    'Sustained vibration and fixed posture compress lumbar discs over time.',
        'Physical labor':            'Repeated bending and load-bearing accelerates disc wear.',
        'Standing/retail':           'Lower risk than sitting, but prolonged standing strains lumbar joints.',
        'Student':                   'Mostly sedentary; risk depends on screen and study habits.',
        'Other':                     'Baseline occupation risk.',
    },
    isWeightlifter: {
        'Gym':          'Incorrect lifting form puts 6× body weight on lumbar discs.',
        'Construction': 'Heavy, repetitive load-bearing is a primary cause of disc herniation.',
        'Both':         'Double exposure — gym and occupational strain compound each other.',
        'No':           'No added weight-bearing strain on your spine.',
    },
    exerciseFrequency: {
        'Never':       'Sedentary lifestyle weakens core muscles that support your spine.',
        '1–2x week':   'Some movement helps, but insufficient for sustained spinal support.',
        '3–5x week':   'Good frequency — core and postural muscles stay conditioned.',
        'Daily':       'Protective factor — regular movement keeps discs hydrated and decompressed.',
    },
    painLevel: {
        'Never':        'No current pain signals — maintain this with regular movement.',
        'Occasionally': 'Intermittent pain suggests early mechanical stress — act now.',
        'Frequently':   'Frequent pain indicates significant disc or nerve involvement.',
        'Chronic':      'Chronic pain is the strongest single predictor of structural damage.',
    },
    postureAwareness: {
        'I slouch constantly':  'Chronic slouching increases spinal load by 40% beyond neutral.',
        'Sometimes':            'Occasional slouching — manageable with habit correction.',
        'I am conscious of it': 'Protective factor — postural awareness significantly reduces compression.',
    },
    sleepPosition: {
        'Stomach':  'Stomach sleeping forces cervical rotation for hours, straining neck and lower back.',
        'Side':     'Generally safe — use a pillow between knees for lumbar alignment.',
        'Back':     'Optimal position — distributes spinal load evenly.',
        'Varies':   'Mixed positions are generally neutral.',
    },
};

// ─── Core algorithm ───────────────────────────────────────────────────────────
export function calculateSpineRisk(data: RiskInput): RiskResult {
    const breakdown: Record<string, number> = {};

    // A. Demographics
    const agePoints: Record<string, number> = {
        'Under 35': 0,
        '35–50':    10,
        '50–65':    15,
        '65+':      20,
    };
    breakdown.age = agePoints[data.ageGroup] ?? 0;

    const genderPoints: Record<string, number> = {
        'Female': 5,
        'Male':   0,
        'Other':  0,
    };
    breakdown.gender = genderPoints[data.gender] ?? 0;

    // B. Lifestyle & Occupation
    const occupationPoints: Record<string, number> = {
        'Desk job (8+ hrs sitting)': 25,
        'Driver':                    20,
        'Physical labor':            15,
        'Standing/retail':           0,
        'Student':                   0,
        'Other':                     0,
    };
    breakdown.occupation = occupationPoints[data.occupationType] ?? 0;

    const weightPoints: Record<string, number> = {
        'Construction': 15,
        'Gym':          10,
        'Both':         10,
        'No':           0,
    };
    breakdown.weightlifting = weightPoints[data.isWeightlifter] ?? 0;

    const exercisePoints: Record<string, number> = {
        'Never':      20,
        '1–2x week':  10,
        '3–5x week':  0,
        'Daily':      -10,
    };
    breakdown.exercise = exercisePoints[data.exerciseFrequency] ?? 0;

    // C. Clinical & Ergonomic Factors
    const painPoints: Record<string, number> = {
        'Never':        0,
        'Occasionally': 15,
        'Frequently':   25,
        'Chronic':      35,
    };
    breakdown.pain = painPoints[data.painLevel] ?? 0;

    const posturePoints: Record<string, number> = {
        'I slouch constantly':  15,
        'Sometimes':            0,
        'I am conscious of it': -5,
    };
    breakdown.posture = posturePoints[data.postureAwareness] ?? 0;

    const sleepPoints: Record<string, number> = {
        'Stomach': 10,
        'Side':    0,
        'Back':    0,
        'Varies':  0,
    };
    breakdown.sleep = sleepPoints[data.sleepPosition] ?? 0;

    // Final score — clamped 0–100
    const raw = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
    const score = Math.max(0, Math.min(100, raw));

    // 4-tier categorisation
    let category: RiskCategory;
    if (score >= 86)      category = 'critical';
    else if (score >= 61) category = 'high';
    else if (score >= 31) category = 'moderate';
    else                  category = 'low';

    // Primary reason — highest positive contributing factor
    const positiveFactors: { label: string; points: number }[] = [
        { label: 'chronic back pain',                     points: breakdown.pain },
        { label: 'prolonged desk sitting (8+ hours)',     points: breakdown.occupation },
        { label: 'sedentary lifestyle (no exercise)',     points: breakdown.exercise },
        { label: 'constant slouching posture',            points: breakdown.posture },
        { label: 'advanced age-related spinal changes',  points: breakdown.age },
        { label: 'heavy occupational lifting',            points: breakdown.weightlifting },
        { label: 'stomach sleeping posture',              points: breakdown.sleep },
        { label: 'heightened bone-density risk (female)', points: breakdown.gender },
    ].filter(f => f.points > 0);

    positiveFactors.sort((a, b) => b.points - a.points);

    const primaryReason = positiveFactors.length > 0
        ? `Your highest risk factor is ${positiveFactors[0].label}, contributing ${positiveFactors[0].points} points to your total score.`
        : 'You have no significant risk factors — maintain your current healthy habits.';

    return { score, category, primaryReason, breakdown };
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
export const TIER_CONFIG: Record<RiskCategory, {
    label: string;
    headline: string;
    subtext: string;
    color: string;
    bg: string;
    glow: string;
}> = {
    low: {
        label:    'Low Risk (0–30)',
        headline: 'Great baseline!',
        subtext:  "Your spine is healthy — keep moving and stay consistent.",
        color:    'text-accent-green',
        bg:       'bg-accent-green/10 border-accent-green/30',
        glow:     'bg-accent-green',
    },
    moderate: {
        label:    'Moderate Risk (31–60)',
        headline: 'Warning signs detected.',
        subtext:  'Ergonomic adjustments and daily exercises are recommended now.',
        color:    'text-accent-amber',
        bg:       'bg-accent-amber/10 border-accent-amber/30',
        glow:     'bg-accent-amber',
    },
    high: {
        label:    'High Risk (61–85)',
        headline: 'Consultation recommended.',
        subtext:  'Your lifestyle creates severe spinal compression — daily care is essential.',
        color:    'text-accent-red',
        bg:       'bg-accent-red/10 border-accent-red/30',
        glow:     'bg-accent-red',
    },
    critical: {
        label:    'Critical Risk (86–100)',
        headline: 'Immediate intervention needed.',
        subtext:  'Multiple high-risk factors are compounding. Seek a spine specialist urgently.',
        color:    'text-accent-red',
        bg:       'bg-accent-red/20 border-accent-red/60',
        glow:     'bg-accent-red',
    },
};
