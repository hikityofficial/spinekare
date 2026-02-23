import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Exercise } from '../types';

export function useAllExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const { data, error } = await supabase
                    .from('exercises')
                    .select('*')
                    .order('category')
                    .order('name');

                if (error) {
                    throw error;
                }

                if (data) {
                    const mapped: Exercise[] = data.map(d => ({
                        id: d.id,
                        name: d.name,
                        description: d.description,
                        targetArea: d.target_area,
                        category: d.category,
                        durationSeconds: d.duration_seconds,
                        reps: d.reps,
                        whatItDoes: d.what_it_does,
                        difficulty: d.difficulty
                    }));
                    setExercises(mapped);
                }
            } catch (err) {
                console.error("Failed to load exercises:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchExercises();
    }, []);

    return { exercises, isLoading, error };
}
