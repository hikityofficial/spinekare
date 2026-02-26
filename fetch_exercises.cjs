import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchExercises() {
    const { data, error } = await supabase.from('exercises').select('*');
    if (error) {
        console.error('Error fetching exercises:', error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

fetchExercises();
