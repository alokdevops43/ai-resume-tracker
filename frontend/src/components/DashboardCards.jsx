import { FileText, Target, Briefcase, Calendar } from 'lucide-react';

export default function DashboardCards({ stats }) {
  if (!stats) return null;

  const cards = [
    { name: 'Total Resumes', value: stats.resumes.total, icon: FileText, change: 'All uploaded files', trend: 'neutral' },
    { name: 'Avg ATS Score', value: `${stats.resumes.averageAtsScore}/100`, icon: Target, change: 'Based on last analysis', trend: stats.resumes.averageAtsScore >= 70 ? 'up' : 'neutral' },
    { name: 'Total Applications', value: stats.jobs.total, icon: Briefcase, change: `${stats.jobs.applied} Applied, ${stats.jobs.offer} Offers`, trend: 'up' },
    { name: 'Upcoming Interviews', value: stats.jobs.interview, icon: Calendar, change: 'Scheduled interviews', trend: stats.jobs.interview > 0 ? 'up' : 'neutral' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <div 
          key={stat.name} 
          className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.name}</p>
              <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-surface-500 dark:text-surface-400'}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
