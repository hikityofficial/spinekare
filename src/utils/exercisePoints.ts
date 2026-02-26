/**
 * Returns the points awarded for completing a given exercise by its 1-based number.
 * Exercise 1,2,7,8,10,12 → 25 pts
 * Exercise 3,4,5,9        → 20 pts
 * Exercise 6,11           → 22 pts
 */
export function getExercisePoints(exerciseNumber: number): number {
    if ([1, 2, 7, 8, 10, 12].includes(exerciseNumber)) return 25;
    if ([3, 4, 5, 9].includes(exerciseNumber)) return 20;
    if ([6, 11].includes(exerciseNumber)) return 22;
    return 20; // fallback
}

/**
 * Returns total points for a list of exercise IDs (1-based numbers).
 */
export function getTotalPoints(exerciseNumbers: number[]): number {
    return exerciseNumbers.reduce((sum, n) => sum + getExercisePoints(n), 0);
}
