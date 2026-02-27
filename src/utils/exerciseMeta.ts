export const exerciseMeta: Record<number, {
    surface: string;
    duration: string;
    sets?: string;
    instruction: string;
    formCues: string[];
    ageRestriction?: string;
}> = {
    1: {
        surface: "Yoga mat (hands and knees)",
        duration: "2 minutes",
        instruction: "Bend backward and hold for 10 seconds, then return to a straight position and hold for 5 seconds. Repeat throughout the duration.",
        formCues: [
            "Hold the back bend for 10 seconds each rep",
            "Return to a straight spine and hold 5 seconds",
            "Breathe in on the arch, exhale as you straighten",
            "Keep movements smooth and controlled"
        ]
    },
    2: {
        surface: "Yoga mat",
        duration: "2 minutes",
        instruction: "Bend backward and hold for 10 seconds, then straighten your body and hold for 5 seconds. Repeat in a steady rhythm.",
        formCues: [
            "Hold each back bend for 10 seconds",
            "Straighten fully and pause for 5 seconds",
            "Breathe deeply — inhale on the bend, exhale on the release",
            "Maintain control throughout each repetition"
        ]
    },
    3: {
        surface: "Yoga mat (hands and knees)",
        duration: "3 minutes",
        instruction: "Get into a dog pose. Extend one hand straight in front and the opposite leg straight behind. Hold for 8 seconds, then switch sides. Alternate throughout.",
        formCues: [
            "Keep hips level — do not rotate your torso",
            "Extend arm and opposite leg simultaneously",
            "Hold each side for 8 seconds before switching",
            "Keep your core tight and spine neutral throughout"
        ]
    },
    4: {
        surface: "Yoga mat (lying face down)",
        duration: "3 minutes",
        instruction: "Lie face down on your stomach. Lift one leg approximately 30 degrees off the ground and hold for 8 seconds. Lower it and repeat with the other leg. Alternate throughout.",
        formCues: [
            "Keep both hips pressed flat against the mat",
            "Raise one leg about 30 degrees — no higher",
            "Hold each leg for 8 seconds before switching",
            "Engage your glutes, not your lower back"
        ]
    },
    5: {
        surface: "Yoga mat (lying face up)",
        duration: "3 minutes",
        instruction: "Lie flat on your back with your body straight. Bring one knee up toward your chest and hold for 8 seconds. Lower it and repeat with the other leg. Alternate throughout.",
        formCues: [
            "Keep your body straight while lying down",
            "Pull one knee gently toward your chest",
            "Hold for 8 seconds, then switch legs",
            "Keep the resting leg flat on the ground"
        ]
    },
    6: {
        surface: "Yoga mat (lying face up)",
        duration: "2 minutes",
        instruction: "Lie flat on your back with your body straight. Pull both knees toward your chest simultaneously and hold. Breathe deeply throughout the hold.",
        formCues: [
            "Keep your body straight before pulling knees up",
            "Bring both knees to your chest at the same time",
            "Clasp your hands around your shins to hold",
            "Breathe deeply and relax your lower back into the mat"
        ]
    },
    7: {
        surface: "Yoga mat (lying face up)",
        duration: "2 minutes",
        instruction: "Lie on your back and perform a side stretch of the waist by gently rotating. Hold for 8 seconds on each side, then switch. Alternate throughout.",
        formCues: [
            "Keep both shoulders flat on the ground",
            "Rotate your lower body gently to one side",
            "Hold each side for 8 seconds before switching",
            "Feel the stretch along your waist and obliques"
        ]
    },
    8: {
        surface: "Bed (head hanging off the edge)",
        duration: "~2 minutes",
        sets: "3 sets × 25 seconds each",
        instruction: "Lie on a bed with your head hanging off the edge. Hold the position for 25 seconds per set, with rest between sets. Complete 3 sets total.",
        formCues: [
            "Position yourself so your head hangs off the bed edge",
            "Let gravity gently stretch your cervical spine",
            "Hold each set for 25 seconds",
            "Rest briefly between the 3 sets"
        ]
    },
    9: {
        surface: "Bed or yoga mat (lying face up)",
        duration: "3 minutes",
        instruction: "Lie flat on your back. Raise one leg so that both the waist and knee form 90-degree angles. Hold for 8 seconds, then switch legs. Alternate throughout.",
        formCues: [
            "Keep your back flat against the surface",
            "Bend both hip and knee to 90 degrees",
            "One leg at a time — hold 8 seconds each",
            "Keep the resting leg flat and relaxed"
        ]
    },
    10: {
        surface: "Yoga mat or comfortable floor",
        duration: "3 minutes",
        instruction: "Stretch your body on both sides by folding one knee at a time. Hold each side for 8 seconds. Alternate between left and right throughout.",
        formCues: [
            "Fold one knee while keeping the other leg straight",
            "Stretch your body to the side of the folded knee",
            "Hold each side for 8 seconds before switching",
            "Feel the stretch along your full lateral body"
        ]
    },
    11: {
        surface: "Bed or yoga mat (lying face up)",
        duration: "~2 minutes",
        sets: "4 sets × 20 seconds each",
        instruction: "Lie on your back with your knees folded. Lift your waist (hips) off the surface for thigh strengthening. Hold for 20 seconds per set. Complete 4 sets total.",
        formCues: [
            "Fold both knees with feet flat on the surface",
            "Lift your hips upward into a bridge position",
            "Hold each set for 20 seconds",
            "Squeeze your glutes and thighs at the top"
        ]
    },
    12: {
        surface: "Yoga mat or comfortable floor",
        duration: "10 seconds (once daily)",
        instruction: "Perform a full-body stretch, extending arms overhead and legs fully. Hold for 10 seconds. Do this once per day only.",
        ageRestriction: "Recommended only for age 25 and under",
        formCues: [
            "Extend your whole body — arms overhead, legs stretched",
            "Hold the stretch for a full 10 seconds",
            "Perform this only once per day",
            "Suitable for younger individuals (under 25)"
        ]
    }
};
