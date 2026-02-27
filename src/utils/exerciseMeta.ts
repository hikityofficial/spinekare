/**
 * exerciseMeta.ts
 * Single source of truth for all 12 exercises — name, targetArea, surface,
 * duration, sets, instruction, formCues, and ageRestriction.
 * Keyed by position (1–12), NOT by Supabase DB id.
 */
export interface ExerciseMeta {
    name: string;
    targetArea: string;
    surface: string;
    duration: string;
    sets?: string;
    instruction: string;
    formCues: string[];
    ageRestriction?: string;
}

export const exerciseMeta: Record<number, ExerciseMeta> = {
    1: {
        name: "Cat-Cow Back Bend (Hands & Knees)",
        targetArea: "Cervical · Lumbar",
        surface: "Yoga mat (hands and knees)",
        duration: "2 minutes",
        instruction: "Start on hands and knees. Bend backward (arch your spine) and hold for 10 seconds, then return to a neutral straight position and hold for 5 seconds. Repeat this cycle continuously throughout the duration.",
        formCues: [
            "Hold the back bend for exactly 10 seconds each rep",
            "Return to a straight, neutral spine and hold 5 seconds",
            "Breathe in on the arch, exhale slowly as you straighten",
            "Keep your arms straight and wrists directly under shoulders",
            "Keep movements smooth and fully controlled"
        ]
    },
    2: {
        name: "Standing Back Bend",
        targetArea: "Cervical · Lumbar",
        surface: "Yoga mat",
        duration: "2 minutes",
        instruction: "Stand upright. Bend backward (extending your spine) and hold for 10 seconds, then straighten your body and hold for 5 seconds. Repeat in a steady, controlled rhythm throughout the duration.",
        formCues: [
            "Hold each back bend for 10 seconds",
            "Straighten fully and pause for 5 seconds between reps",
            "Breathe deeply — inhale on the bend, exhale on the release",
            "Keep your knees slightly soft, do not lock them",
            "Place hands on lower back for support if needed"
        ]
    },
    3: {
        name: "Bird-Dog (Opposite Arm & Leg)",
        targetArea: "Lumbar · Core",
        surface: "Yoga mat (hands and knees)",
        duration: "3 minutes",
        instruction: "Get into a tabletop (dog) pose on hands and knees. Extend one hand straight in front and the opposite leg straight behind simultaneously. Hold for 8 seconds, then switch to the other arm and leg. Alternate throughout the full duration.",
        formCues: [
            "Keep hips level — do not rotate your torso",
            "Extend arm and opposite leg at the same time",
            "Hold each side for 8 seconds before switching",
            "Keep your core tight and spine completely neutral",
            "Gaze at the floor — do not lift your head up"
        ]
    },
    4: {
        name: "Prone Leg Raise (Face Down)",
        targetArea: "Lumbar · Sacral",
        surface: "Yoga mat (lying face down)",
        duration: "3 minutes",
        instruction: "Lie face down flat on your stomach with legs straight. Lift one leg approximately 30 degrees off the ground, keeping the knee straight. Hold for 8 seconds, then lower it. Repeat with the other leg. Alternate throughout.",
        formCues: [
            "Keep both hips pressed flat against the mat at all times",
            "Raise one leg only about 30 degrees — no higher",
            "Hold each leg for 8 seconds before switching sides",
            "Engage your glutes to lift, not your lower back",
            "Keep your head resting on your hands or the mat"
        ]
    },
    5: {
        name: "Single Knee-to-Chest (Supine)",
        targetArea: "Lumbar · Sacral",
        surface: "Yoga mat (lying face up)",
        duration: "3 minutes",
        instruction: "Lie flat on your back with both legs extended straight. Bring one knee up toward your chest and hold for 8 seconds. Lower it back down and repeat with the other leg. Alternate legs continuously throughout.",
        formCues: [
            "Keep your body flat while lying down before lifting",
            "Pull one knee gently but firmly toward your chest",
            "Hold the position for 8 seconds, then switch legs",
            "Keep the resting leg fully extended flat on the ground",
            "Use both hands to clasp behind the lifted knee"
        ]
    },
    6: {
        name: "Double Knee-to-Chest (Supine)",
        targetArea: "Lumbar · Sacral",
        surface: "Yoga mat (lying face up)",
        duration: "2 minutes",
        instruction: "Lie flat on your back with your body straight. Pull both knees up toward your chest simultaneously and hold the position. Breathe deeply and relax your lower back into the mat throughout the hold.",
        formCues: [
            "Start with both legs extended, then bring both knees up together",
            "Bring both knees as close to your chest as comfortable",
            "Clasp your hands around your shins or behind your knees to hold",
            "Breathe deeply and let gravity relax your lower back into the mat",
            "Hold as long as comfortable within the 2 minute duration"
        ]
    },
    7: {
        name: "Supine Waist Rotation Stretch",
        targetArea: "Lumbar · Sacral",
        surface: "Yoga mat (lying face up)",
        duration: "2 minutes",
        instruction: "Lie on your back. Gently rotate your lower body (bent knees) to one side for a side stretch of the waist. Hold for 8 seconds on each side, then rotate to the opposite side. Alternate throughout the full duration.",
        formCues: [
            "Keep both shoulders flat and pressed on the ground",
            "Rotate your bent knees gently to one side",
            "Hold each side for 8 seconds before switching",
            "Feel the stretch along your waist and obliques",
            "Do not force the rotation — let gravity do the work"
        ]
    },
    8: {
        name: "Cervical Traction (Head Hang)",
        targetArea: "Cervical",
        surface: "Bed (head hanging off the edge)",
        duration: "~2 minutes total",
        sets: "3 sets × 25 seconds each",
        instruction: "Lie on a bed so that your head and neck hang off the edge. Let gravity gently decompress and stretch your cervical spine. Hold each set for 25 seconds, then rest briefly. Complete 3 sets total.",
        formCues: [
            "Position yourself so your shoulders are at the bed edge",
            "Allow your head to hang freely — do not tense your neck",
            "Let gravity gently stretch your cervical spine",
            "Hold each set for a full 25 seconds",
            "Rest 15–20 seconds between each of the 3 sets"
        ]
    },
    9: {
        name: "90-90 Hip Flexor Raise (Supine)",
        targetArea: "Lumbar · Sacral",
        surface: "Bed or yoga mat (lying face up)",
        duration: "3 minutes",
        instruction: "Lie flat on your back. Raise one leg so that both the hip (waist) and knee form 90-degree angles. Hold for 8 seconds, then lower the leg. Switch to the other leg. Alternate throughout the full duration.",
        formCues: [
            "Keep your back completely flat against the surface",
            "Bend both your hip and knee to exactly 90 degrees",
            "One leg at a time — hold each side 8 seconds",
            "Keep the resting leg flat and fully relaxed on the surface",
            "Breathe steadily and do not hold your breath"
        ]
    },
    10: {
        name: "Lateral Body Stretch (Knee Fold)",
        targetArea: "Lumbar · Sacral",
        surface: "Yoga mat or comfortable floor",
        duration: "3 minutes",
        instruction: "Lie or sit comfortably. Stretch your body on both sides by folding one knee at a time and stretching to that side. Hold each side for 8 seconds, then switch. Alternate between left and right throughout the full duration.",
        formCues: [
            "Fold one knee while keeping the other leg straight",
            "Stretch your entire body to the side of the folded knee",
            "Hold each side for 8 seconds before switching",
            "Feel the full lateral body stretch from shoulder to hip",
            "Keep your breathing slow and deep throughout"
        ]
    },
    11: {
        name: "Glute Bridge (Hip Lift for Thigh Strengthening)",
        targetArea: "Lumbar · Sacral",
        surface: "Bed or yoga mat (lying face up)",
        duration: "~2 minutes total",
        sets: "4 sets × 20 seconds each",
        instruction: "Lie on your back with both knees folded and feet flat on the surface. Lift your waist (hips) off the surface into a bridge position for thigh and glute strengthening. Hold for 20 seconds per set. Complete 4 sets with brief rest between sets.",
        formCues: [
            "Fold both knees with feet flat, hip-width apart",
            "Lift your hips upward into a straight bridge position",
            "Hold each set for a full 20 seconds",
            "Squeeze your glutes and thighs firmly at the top",
            "Do not let your hips sag — keep the bridge level"
        ]
    },
    12: {
        name: "Full-Body Supine Stretch",
        targetArea: "Cervical · Lumbar · Sacral",
        surface: "Yoga mat or comfortable floor",
        duration: "10 seconds (once daily)",
        ageRestriction: "Recommended only for age 25 and under",
        instruction: "Lie flat on your back. Extend both arms fully overhead and stretch both legs fully in the opposite direction, elongating your entire body. Hold the full stretch for 10 seconds. Perform this exercise only once per day.",
        formCues: [
            "Extend your whole body — arms overhead, legs pointed away",
            "Reach as far as you can in both directions simultaneously",
            "Hold the stretch for a full 10 seconds",
            "Breathe naturally throughout the stretch",
            "Perform this only once per day — do not repeat"
        ]
    }
};
