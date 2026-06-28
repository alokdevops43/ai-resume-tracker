import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardCards from '../components/DashboardCards';
import { api } from '../context/AuthContext';
import { FileText, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-900 transition-colors duration-200 relative">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Overview</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Here's a summary of your resume and application activity.
        </p>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-24 bg-surface-200 dark:bg-surface-700 rounded-xl"></div>
          </div>
        </div>
      ) : (
        <DashboardCards stats={stats} />
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/dashboard/upload" className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-surface-900 dark:text-white">Analyze New Resume</h4>
                <p className="text-sm text-surface-500 dark:text-surface-400">Upload and get ATS score</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-surface-400 group-hover:text-primary-600 transition-colors" />
          </Link>
        </div>
      </div>
    </>
  );
}
