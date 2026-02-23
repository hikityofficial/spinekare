import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { SpineFact } from '../types';
import { BookOpen, Search } from 'lucide-react';

export default function Facts() {
    const [searchTerm, setSearchTerm] = useState('');
    const [facts, setFacts] = useState<SpineFact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFacts = async () => {
            const { data, error } = await supabase
                .from('spine_facts')
                .select('*')
                .order('id', { ascending: true });

            if (data && !error) {
                setFacts(data.map(d => ({
                    id: d.id,
                    fact: d.fact,
                    category: d.category,
                    dayNumber: d.day_number
                })));
            }
            setIsLoading(false);
        };
        fetchFacts();
    }, []);

    const filteredFacts = facts.filter(item =>
        item.fact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-cyan/10 text-accent-cyan rounded-radius-lg">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-primary">Spine Facts Archive</h1>
                        <p className="text-text-secondary">Discover fascinating insights about human bio-mechanics.</p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <input
                        type="text"
                        placeholder="Search facts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-bg-secondary border border-border rounded-full py-2.5 pl-10 pr-4 text-text-primary focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center text-text-secondary animate-pulse">
                        Loading clinical archive...
                    </div>
                ) : filteredFacts.length > 0 ? (
                    filteredFacts.map(fact => (
                        <div key={fact.id} className="bg-bg-card border border-border rounded-radius-lg p-6 hover:border-accent-cyan/50 transition-colors flex flex-col h-full group">
                            <div className="text-3xl font-display font-bold text-border group-hover:text-accent-cyan/20 transition-colors mb-4">
                                #{fact.id.toString().padStart(3, '0')}
                            </div>
                            <p className="text-text-primary leading-relaxed flex-1">
                                "{fact.fact}"
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-text-secondary">
                        No facts found matching "{searchTerm}"
                    </div>
                )}
            </div>

        </div>
    );
}
