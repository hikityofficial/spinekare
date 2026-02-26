import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';

import Dashboard from './pages/Dashboard';
import RoutinePlayer from './pages/RoutinePlayer';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AtRisk from './pages/AtRisk';
import Facts from './pages/Facts';
import ExerciseLibrary from './pages/ExerciseLibrary';
import CustomPlans from './pages/CustomPlans';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-6">
        <span className="text-4xl">🦴</span>
      </div>
      <h1 className="text-5xl font-display font-extrabold text-text-primary mb-3">404</h1>
      <p className="text-xl text-text-secondary mb-2 font-medium">Page not found</p>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="px-6 py-3 bg-accent-cyan text-bg-primary font-bold rounded-radius-lg hover:bg-accent-cyan-dim transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-bg-card border border-border text-text-primary font-bold rounded-radius-lg hover:bg-bg-secondary transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* Semi-protected (must be auth'd but not necessarily onboarded) */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Fully protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/library" element={<ExerciseLibrary />} />
                <Route path="/plans" element={<CustomPlans />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/at-risk" element={<AtRisk />} />
                <Route path="/spine-facts" element={<Facts />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Full screen player */}
              <Route path="/routine" element={<RoutinePlayer />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
