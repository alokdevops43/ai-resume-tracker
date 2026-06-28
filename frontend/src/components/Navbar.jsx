import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center bg-surface-100 dark:bg-surface-900 rounded-lg px-3 py-1.5 border border-surface-200 dark:border-surface-700">
          <Search className="h-4 w-4 text-surface-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-48 text-surface-700 dark:text-surface-300 placeholder-surface-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-800"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-surface-200 dark:border-surface-700">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold border border-primary-200 dark:border-primary-800">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
