import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Play } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (!email || !password) return;

        setIsLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/dashboard');
        } catch (error: any) {
            setErrorMsg(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            setIsLoading(true);
            // In Supabase, OAuth auto-redirects
            await login('', ''); // The empty password triggers OAuth in our context 
        } catch (error: any) {
            setErrorMsg(error.message || 'Google Auth failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex">
            {/* Left Side - Branding (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 bg-bg-secondary flex-col items-center justify-between p-12 border-r border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,204,0.05),transparent_70%)]"></div>

                <div className="w-full flex justify-between items-center relative z-10">
                    <h1 className="text-3xl font-display font-bold flex items-center gap-2 text-text-primary">
                        <span className="text-accent-cyan">Spin</span>Care
                    </h1>
                    <span className="text-text-secondary text-sm font-semibold tracking-widest uppercase">
                        Clinical Wellness
                    </span>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                    <div className="w-48 h-48 mb-8 border border-accent-cyan/20 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-4 rounded-full border border-dashed border-accent-cyan/40 animate-[spin_20s_linear_infinite]"></div>
                        <Play className="text-accent-cyan w-12 h-12" />
                        <p className="absolute -bottom-8 text-accent-cyan text-sm tracking-wide">3D SPINE VISUALIZER</p>
                    </div>

                    <h2 className="text-4xl font-display font-bold text-text-primary mb-4">
                        Your daily spine habit.
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed mb-8">
                        Guided routines, posture correction, and clinical insights tailored to your daily lifestyle. Just 5 minutes a day.
                    </p>
                </div>

                <div className="relative z-10 w-full bg-bg-card border border-border p-6 rounded-radius-lg">
                    <p className="text-accent-cyan text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <ShieldCheck size={16} /> Clinical Insight
                    </p>
                    <p className="text-text-primary font-body text-lg italic">
                        "Eighty percent of adults will experience significant back pain in their lifetime. Prevention requires daily biomechanical maintenance."
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="absolute inset-0 block lg:hidden bg-[radial-gradient(circle_at_center,rgba(0,229,204,0.05),transparent_70%)]"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="lg:hidden mb-12 text-center">
                        <h1 className="text-4xl font-display font-bold flex items-center justify-center gap-2">
                            <span className="text-accent-cyan">Spin</span>Care
                        </h1>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
                            {isLogin ? 'Welcome back' : 'Start your journey'}
                        </h2>
                        <p className="text-text-secondary">
                            {isLogin ? 'Enter your details to access your routine.' : 'Create an account to get your personalized plan.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {errorMsg && (
                            <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red px-4 py-3 rounded-radius-lg text-sm font-semibold">
                                {errorMsg}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-bg-secondary border border-border rounded-radius-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-bg-secondary border border-border rounded-radius-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 mt-2 transition-colors flex items-center justify-center gap-2 rounded-radius-lg font-bold ${isLoading ? 'bg-text-secondary text-bg-primary cursor-not-allowed' : 'bg-text-primary hover:bg-white text-bg-primary'}`}
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')} {!isLoading && <ArrowRight size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleAuth}
                            className="w-full py-3.5 bg-bg-card border border-border hover:bg-bg-secondary text-text-primary font-bold rounded-radius-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className="mt-8 text-center text-text-secondary text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-accent-cyan hover:text-accent-cyan-dim font-bold transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
