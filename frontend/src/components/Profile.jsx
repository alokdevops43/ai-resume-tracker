import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { User, Mail, Calendar, FileText, Briefcase, Target, BrainCircuit } from 'lucide-react';

export default function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;
  }

  const joinDate = new Date(stats.user.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Your Profile</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Manage your account and view your overall progress.
        </p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-3xl border border-primary-200 dark:border-primary-800 shrink-0">
          {stats.user.email[0].toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            {stats.user.email}
          </h3>
          <div className="mt-2 flex flex-col sm:flex-row gap-4 text-sm text-surface-500 dark:text-surface-400">
            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> Account Email</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {joinDate}</span>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-surface-900 dark:text-white mt-8 mb-4">Lifetime Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-white">{stats.resumes.total}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Total Resumes</p>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-white">{stats.jobs.total}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Job Applications</p>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-white">{stats.resumes.averageAtsScore}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Avg ATS Score</p>
        </div>
      </div>
    </div>
  );
}
