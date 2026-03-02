import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Exercise } from '../types';
import { LOCAL_EXERCISES } from '../data/localExercises';

/**
 * Returns all 12 exercises, always.
 * 
 * Strategy:
 * 1. Start immediately with LOCAL_EXERCISES (all 12, instant render).
 * 2. Fetch from Supabase in the background.
 * 3. For each DB row, if it matches a local exercise by id, merge the
 *    DB fields (name, whatItDoes, difficulty, etc.) onto the local base.
 *    This keeps position/image alignment correct while allowing DB overrides.
 * 4. If Supabase returns no data or errors, the local data is used as-is.
 */
export function useAllExercises() {
    const [exercises, setExercises] = useState<Exercise[]>(LOCAL_EXERCISES);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndMerge = async () => {
            try {
                const { data, error } = await supabase
                    .from('exercises')
                    .select('*')
                    .order('id');

                if (error) throw error;

                if (data && data.length > 0) {
                    // Build a lookup map from DB by id
                    const dbMap: Record<number, any> = {};
                    data.forEach(row => { dbMap[row.id] = row; });

                    // Merge DB data onto local base (local position always wins)
                    const merged: Exercise[] = LOCAL_EXERCISES.map(local => {
                        const db = dbMap[local.id];
                        if (!db) return local; // DB doesn't have this exercise — keep local
                        return {
                            ...local,
                            // Override with DB values only if they're not empty
                            name:            db.name            || local.name,
                            description:     db.description     || local.description,
                            whatItDoes:      db.what_it_does    || local.whatItDoes,
                            difficulty:      db.difficulty      || local.difficulty,
                            durationSeconds: db.duration_seconds ?? local.durationSeconds,
                            reps:            db.reps            || local.reps,
                            category:        db.category        || local.category,
                            // position is always from local to prevent image misalignment
                        };
                    });
                    setExercises(merged);
                }
                // If DB returns empty, local data stays (already set in useState)
            } catch (err) {
                console.warn('Supabase exercise fetch failed — using local data:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // exercises stays as LOCAL_EXERCISES (set in useState)
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndMerge();
    }, []);

    return { exercises, isLoading, error };
}
