import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Activity, ShieldAlert, HeartPulse } from 'lucide-react';

export default function AtRisk() {
    const { user } = useAuth();

    const getRiskColor = (tier?: string) => {
        if (tier === 'low') return 'text-accent-green';
        if (tier === 'moderate') return 'text-accent-amber';
        return 'text-accent-red';
    };

    const getRiskBg = (tier?: string) => {
        if (tier === 'low') return 'bg-accent-green/10';
        if (tier === 'moderate') return 'bg-accent-amber/10';
        return 'bg-accent-red/10';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className={`p-3 rounded-radius-lg ${getRiskBg(user?.riskTier)} ${getRiskColor(user?.riskTier)}`}>
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-primary">Your Risk Analysis</h1>
                    <p className="text-text-secondary">Detailed breakdown of mechanical stress and prevention strategies.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Current Status Card */}
                <div className="bg-bg-card rounded-radius-lg border border-border p-8 flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Overall Spine Score</div>
                    <div className={`text-8xl font-display font-bold mb-4 ${getRiskColor(user?.riskTier)}`}>
                        {user?.spineRiskScore || 0}
                    </div>
                    <div className={`text-xl font-bold mb-2 ${getRiskColor(user?.riskTier)} uppercase tracking-widest`}>
                        {user?.riskTier} Risk
                    </div>
                    <p className="text-text-secondary mt-4 max-w-sm">
                        {user?.riskTier === 'high' && "Your responses indicate significant mechanical stress. Immediate intervention is recommended through daily routines."}
                        {user?.riskTier === 'moderate' && "You have developed habits that increase compression risk. Daily mobility exercises can reverse this trajectory."}
                        {user?.riskTier === 'low' && "Excellent baseline. Focus on maintaining your current posture and activity levels."}
                    </p>
                </div>

                {/* Breakdown Card */}
                <div className="space-y-4">
                    <div className="bg-bg-card rounded-radius-lg border border-border p-6">
                        <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
                            <Activity className="text-accent-amber" size={20} /> Cervical Stress (Neck)
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">Forward head posture from screen usage adds up to 60lbs of pressure to the cervical spine.</p>
                        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-accent-amber w-[75%] rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-bg-card rounded-radius-lg border border-border p-6">
                        <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
                            <AlertTriangle className="text-accent-red" size={20} /> Lumbar Load (Lower Back)
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">Prolonged sitting increases lumbar disc pressure by 40% compared to standing.</p>
                        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-accent-red w-[85%] rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-bg-card rounded-radius-lg border border-border p-6">
                        <h3 className="font-bold text-text-primary flex items-center gap-2 mb-4">
                            <HeartPulse className="text-accent-cyan" size={20} /> Core Stability
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">A strong core acts as a natural corset, reducing load on intervertebral discs.</p>
                        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-accent-cyan w-[40%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prevention Strategies */}
            <h2 className="text-2xl font-display font-bold text-text-primary mt-12 mb-6">Action Plan</h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-accent-cyan/5 border border-accent-cyan/20 p-6 rounded-radius-lg">
                    <h4 className="font-bold text-text-primary mb-2">1. Micro-Breaks</h4>
                    <p className="text-sm text-text-secondary">Stand up for 2 minutes every hour to reset disc hydration and muscular tension.</p>
                </div>
                <div className="bg-accent-cyan/5 border border-accent-cyan/20 p-6 rounded-radius-lg">
                    <h4 className="font-bold text-text-primary mb-2">2. Daily Routines</h4>
                    <p className="text-sm text-text-secondary">Complete the personalized 5-minute SpinCare routine daily to build endurance.</p>
                </div>
                <div className="bg-accent-cyan/5 border border-accent-cyan/20 p-6 rounded-radius-lg">
                    <h4 className="font-bold text-text-primary mb-2">3. Ergonomics</h4>
                    <p className="text-sm text-text-secondary">Ensure top of screen is at eye level and lower back is supported by your chair.</p>
                </div>
            </div>

        </div>
    );
}
