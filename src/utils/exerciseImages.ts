import sse1 from '../assets/sse1.png';
import sse2 from '../assets/sse2.png';
import sse3 from '../assets/sse3.png';
import sse4 from '../assets/sse4.png';
import sse5 from '../assets/sse5.png';
import sse6 from '../assets/sse6.png';
import sse7 from '../assets/sse7.png';
import sse8 from '../assets/sse8.png';
import sse9 from '../assets/sse9.png';
import sse10 from '../assets/sse10.png';
import sse11 from '../assets/sse11.png';
import sse12 from '../assets/sse12.png';

const imageMap: Record<number, string> = {
    1: sse1,
    2: sse2,
    3: sse3,
    4: sse4,
    5: sse5,
    6: sse6,
    7: sse7,
    8: sse8,
    9: sse9,
    10: sse10,
    11: sse11,
    12: sse12,
};

export const getExerciseImage = (id: number): string => {
    // Fallback to sse1 if out of bounds
    return imageMap[id] || sse1;
};
