import { useState, useEffect } from 'react';
import { MapPin, Phone, ExternalLink } from 'lucide-react';

interface Clinic {
    name: string;
    address: string;
    phone?: string;
    mapsQuery: string;
}

const DEFAULT_CLINICS: Clinic[] = [
    { name: "Spine & Ortho Care", address: "Nearest to your location", mapsQuery: "spine clinic near me", phone: undefined },
];

export default function ConsultationFinder() {
    const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null);
    const [mapsUrl, setMapsUrl] = useState('https://www.google.com/maps/search/spine+clinic+near+me');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setMapsUrl(
                        `https://www.google.com/maps/search/spine+clinic+near+me/@${latitude},${longitude},14z`
                    );
                    setLocationAllowed(true);
                },
                () => {
                    setLocationAllowed(false);
                },
                { timeout: 5000 }
            );
        } else {
            setLocationAllowed(false);
        }
    }, []);

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

            {/* CTA */}
            <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan rounded-radius-md text-xs font-bold transition-colors"
            >
                <ExternalLink size={13} />
                {locationAllowed === true ? 'Open Nearby Map' : 'Search on Maps'}
            </a>

            {/* Static clinic card fallback */}
            {DEFAULT_CLINICS.map((clinic, i) => (
                <div key={i} className="bg-bg-card border border-border rounded-radius-md p-3 text-xs">
                    <p className="font-bold text-text-primary truncate">{clinic.name}</p>
                    <p className="text-text-secondary mt-0.5 leading-relaxed">{clinic.address}</p>
                    {clinic.phone && (
                        <a href={`tel:${clinic.phone}`} className="flex items-center gap-1 mt-1.5 text-accent-cyan hover:underline font-bold">
                            <Phone size={11} /> {clinic.phone}
                        </a>
                    )}
                </div>
            ))}

            {/* Ad label */}
            <p className="text-[9px] text-text-secondary/40 text-center tracking-widest uppercase font-bold">Sponsored</p>
        </div>
    );
}
