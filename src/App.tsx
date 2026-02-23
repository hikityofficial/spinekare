import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/at-risk" element={<AtRisk />} />
                <Route path="/spine-facts" element={<Facts />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Full screen player */}
              <Route path="/routine" element={<RoutinePlayer />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-10">404 - Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
