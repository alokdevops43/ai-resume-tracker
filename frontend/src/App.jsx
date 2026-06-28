import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard, { DashboardHome } from './pages/Dashboard';

import ResumeUpload from './components/ResumeUpload';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import JobTracker from './components/JobTracker';
import Profile from './components/Profile';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Temporary placeholder components for nested routes
const Placeholder = ({ title }) => (
  <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-8 text-center h-64 flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{title}</h2>
    <p className="text-surface-500 dark:text-surface-400 mt-2">Coming soon...</p>
  </div>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="upload" element={<ResumeUpload />} />
        <Route path="analyzer" element={<ResumeAnalyzer />} />
        <Route path="jobs" element={<JobTracker />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
