import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BrainCircuit, Briefcase, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Resume', path: '/dashboard/upload', icon: FileText },
    { name: 'AI Analyzer', path: '/dashboard/analyzer', icon: BrainCircuit },
    { name: 'Job Tracker', path: '/dashboard/jobs', icon: Briefcase },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex-col h-full shadow-lg md:shadow-none transition-transform duration-300 md:translate-x-0 flex",
        isOpen ? "translate-x-0" : "-translate-x-full hidden md:flex"
      )}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <BrainCircuit className="h-8 w-8" />
            <span>ResumeAI</span>
          </h1>
          <button 
            className="md:hidden text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 hover:text-surface-900 dark:hover:text-surface-200'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
