import { useState, useEffect } from 'react';
import { MapPin, Phone, ExternalLink } from 'lucide-react';

import { supabase } from '../lib/supabase';

interface Clinic {
    id: number;
    name: string;
    address: string;
    phone_number?: string;
    website_url?: string;
    latitude: number;
    longitude: number;
    distanceKm?: number;
}

// Haversine formula to calculate distance between two lat/lon points in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function ConsultationFinder() {
    const [nearestClinic, setNearestClinic] = useState<Clinic | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initClinics = async () => {
            // Ask for location first
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        await fetchAndSortClinics(latitude, longitude);
                    },
                    async () => {
                        // If no location, still fetch but maybe show first one
                        await fetchAndSortClinics(null, null);
                    },
                    { timeout: 5000 }
                );
            } else {
                await fetchAndSortClinics(null, null);
            }
        };

        initClinics();
    }, []);

    const fetchAndSortClinics = async (userLat: number | null, userLon: number | null) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('clinics').select('*');
            if (error || !data || data.length === 0) {
                setNearestClinic(null);
                return;
            }

            let clinicsData: Clinic[] = data;

            if (userLat !== null && userLon !== null) {
                clinicsData = clinicsData.map(c => ({
                    ...c,
                    distanceKm: calculateDistance(userLat, userLon, c.latitude, c.longitude)
                })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
            }

            setNearestClinic(clinicsData[0]);
        } catch (e) {
            console.error("Error fetching clinics", e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-bg-card border border-border rounded-radius-md p-4 flex justify-center">
                <div className="animate-pulse flex items-center gap-2">
                    <MapPin size={14} className="text-text-secondary" />
                    <span className="text-xs text-text-secondary">Locating specialists...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-3">
            {/* Header */}
            <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-2">
                    <MapPin size={18} className="text-accent-cyan" />
                </div>
                <p className="text-xs font-extrabold text-text-primary uppercase tracking-widest">Consultation</p>
                <p className="text-[10px] text-text-secondary mt-0.5">Find a spine specialist near you</p>
            </div>

            {/* Clinic card */}
            {nearestClinic ? (
                <div className="bg-bg-card border border-border rounded-radius-md p-3 text-xs">
                    <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-text-primary">{nearestClinic.name}</p>
                        {nearestClinic.distanceKm !== undefined && (
                            <span className="text-[10px] bg-bg-secondary px-1.5 py-0.5 rounded text-text-secondary whitespace-nowrap">
                                {nearestClinic.distanceKm.toFixed(1)} km
                            </span>
                        )}
                    </div>
                    <p className="text-text-secondary mt-0.5 leading-relaxed">{nearestClinic.address}</p>

                    <div className="flex flex-col gap-2 mt-3">
                        {nearestClinic.phone_number && (
                            <a href={`tel:${nearestClinic.phone_number}`} className="flex items-center gap-1.5 text-accent-cyan hover:underline font-bold bg-accent-cyan/5 w-full py-2 rounded-radius-md justify-center border border-accent-cyan/20">
                                <Phone size={13} /> Call Clinic
                            </a>
                        )}
                        {nearestClinic.website_url && (
                            <a href={nearestClinic.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-secondary font-bold bg-bg-card w-full py-2 rounded-radius-md justify-center border border-border transition-colors">
                                <ExternalLink size={13} /> Visit Website
                            </a>
                        )}
                        <a href={`https://www.google.com/maps/search/?api=1&query=${nearestClinic.latitude},${nearestClinic.longitude}`} target="_blank" rel="noopener noreferrer" className="text-center text-[10px] text-text-secondary underline mt-1">
                            Open in Google Maps
                        </a>
                    </div>
                </div>
            ) : (
                <div className="bg-bg-card border border-border rounded-radius-md p-4 text-center text-xs text-text-secondary">
                    No partner clinics found in your area yet.
                </div>
            )}

            {/* Ad label */}
            <p className="text-[9px] text-text-secondary/40 text-center tracking-widest uppercase font-bold">Sponsored</p>
        </div>
    );
}
