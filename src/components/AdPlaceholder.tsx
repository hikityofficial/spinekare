interface AdPlaceholderProps {
    type: 'banner' | 'sidebar' | 'rectangle';
    className?: string;
}

export default function AdPlaceholder({ type, className = '' }: AdPlaceholderProps) {
    const dimensions = {
        banner: 'w-full h-[50px] md:h-[90px]',
        sidebar: 'w-full min-h-[600px]',
        rectangle: 'w-[300px] h-[250px]'
    };

    return (
        <div
            className={`bg-bg-secondary/50 border border-border/30 rounded flex flex-col items-center justify-center gap-2 overflow-hidden relative group ${dimensions[type]} ${className}`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,204,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-[10px] text-text-secondary/50 tracking-widest uppercase font-bold relative z-10">Advertisement</span>
            <div className="text-center p-4 text-xs text-text-secondary/40 relative z-10">
                [ {type.charAt(0).toUpperCase() + type.slice(1)} Ad Space ]
            </div>

            {/* Simulation of where Google Adsense script will inject */}
            <div className="hidden complete-ad-injection-point"></div>
        </div>
    );
}
