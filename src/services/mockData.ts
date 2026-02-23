import type { Exercise, Routine, SpineFact } from '../types';

export const mockExercises: Exercise[] = [
  {
    id: 1,
    name: 'Cat-Cow Stretch',
    description: 'A gentle flow between two animal poses that warms the body and brings flexibility to the spine.',
    targetArea: 'full',
    category: 'Flexibility',
    durationSeconds: 60,
    whatItDoes: 'Improves lumbar flexibility and relieves disc compression',
    difficulty: 'beginner'
  },
  {
    id: 2,
    name: 'Child\'s Pose',
    description: 'A resting posture that stretches the back muscles and decompresses the spine.',
    targetArea: 'lumbar',
    category: 'Decompression',
    durationSeconds: 45,
    whatItDoes: 'Gently stretches the lower back and hips, relieving tension',
    difficulty: 'beginner'
  },
  {
    id: 3,
    name: 'Bird Dog',
    description: 'A floor exercise that strengthens the core while moving the limbs.',
    targetArea: 'core',
    category: 'Strengthening',
    durationSeconds: 60,
    whatItDoes: 'Builds core stability to protect the lower spine',
    difficulty: 'intermediate'
  },
  {
    id: 4,
    name: 'Thoracic Rotation',
    description: 'Opening up the mid-back to prevent stiffness from sitting.',
    targetArea: 'thoracic',
    category: 'Mobility',
    durationSeconds: 45,
    whatItDoes: 'Prevents upper back rounding and improves breathing mechanics',
    difficulty: 'beginner'
  },
  {
    id: 5,
    name: 'Cervical Retraction (Chin Tucks)',
    description: 'Pulling the head straight back to align the neck.',
    targetArea: 'cervical',
    category: 'Posture correction',
    durationSeconds: 30,
    reps: '10 reps',
    whatItDoes: 'Counteracts "text neck" and forward head posture',
    difficulty: 'beginner'
  },
  {
    id: 6,
    name: 'Prone Cobra',
    description: 'Lying on the stomach and lifting the chest slightly.',
    targetArea: 'lumbar',
    category: 'Strengthening',
    durationSeconds: 45,
    whatItDoes: 'Strengthens the erector spinae muscles along the spine',
    difficulty: 'intermediate'
  }
];

// Generate 30 routines programmatically for mock data
export const generateMockRoutines = (): Routine[] => {
  const routines: Routine[] = [];
  const focusAreas = ['Full Spine Mobility', 'Lumbar Relief', 'Core Stability', 'Cervical & Posture', 'Thoracic Opening'];

  for (let i = 1; i <= 30; i++) {
    // Pick 4-5 semi-random exercises based on day
    const numExercises = (i % 2 === 0) ? 5 : 4;
    const routineExercises = [];
    for (let j = 0; j < numExercises; j++) {
      const exIndex = (i + j) % mockExercises.length;
      routineExercises.push(mockExercises[exIndex]);
    }

    routines.push({
      id: i,
      dayNumber: i,
      title: `Day ${i} — ${focusAreas[i % focusAreas.length]}`,
      focusArea: focusAreas[i % focusAreas.length],
      estimatedMinutes: numExercises + Math.floor(numExercises * 0.25), // rough estimate with rests
      exercises: routineExercises
    });
  }
  return routines;
};

export const mockRoutines = generateMockRoutines();

// Generate some sample spine facts
export const generateMockFacts = (): SpineFact[] => {
  const baseFacts = [
    "The intervertebral discs in your spine act as shock absorbers and are 80% water when you wake up.",
    "Your spine has natural curves — the S-shape is a biomechanical marvel that distributes load across your body.",
    "Humans lose about 1cm of height throughout the day as spinal discs compress under gravity.",
    "The spinal cord is only about 45cm long but controls everything below your brain.",
    "Back pain is the #1 cause of disability globally, affecting 540 million people at any given time.",
    "There are 33 vertebrae in the human spine: 7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, and 4 fused coccygeal.",
    "Sitting puts up to 40% more pressure on your spine than standing.",
    "Text neck can add up to 50 lbs of extra pressure on your cervical spine.",
    "A strong core acts like a muscular corset, taking up to 30% of the load off your lower back."
  ];

  const facts: SpineFact[] = [];
  for (let i = 1; i <= 100; i++) {
    facts.push({
      id: i,
      dayNumber: i,
      fact: baseFacts[i % baseFacts.length],
      category: 'Anatomy'
    });
  }
  return facts;
};

export const mockSpineFacts = generateMockFacts();
