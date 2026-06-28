import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Calendar, Briefcase, Building, FileText, X, Search, Filter, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({ company: '', title: '', status: 'Applied', notes: '' });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

  useEffect(() => {
    fetchJobs();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      showToast('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({ company: job.company, title: job.title, status: job.status, notes: job.notes || '' });
    } else {
      setEditingJob(null);
      setFormData({ company: '', title: '', status: 'Applied', notes: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, formData);
        showToast('Job updated successfully');
      } else {
        await api.post('/jobs', formData);
        showToast('Job added successfully');
      }
      fetchJobs();
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save job', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      showToast('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      showToast('Failed to delete job', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Interview': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Offer': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-400';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center py-10 text-surface-500">Loading jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={cn(
          "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300",
          toast.type === 'success' ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Job Tracker</h2>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Keep track of your job applications and their statuses.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          Add Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search company or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 appearance-none"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 border-dashed p-12 text-center">
          <Briefcase className="h-12 w-12 text-surface-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">No jobs found</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {jobs.length === 0 ? 'Start organizing your job search by adding your first application.' : 'No applications match your search criteria.'}
          </p>
          {jobs.length === 0 && (
            <button onClick={() => openModal()} className="text-primary-600 font-medium hover:underline">Add your first job</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 flex flex-col hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={cn("px-3 py-1 text-xs font-semibold rounded-full border", getStatusColor(job.status))}>
                  {job.status}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(job)} className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1 truncate">{job.title}</h3>
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400 mb-4">
                <Building className="h-4 w-4 shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
              
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-500">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{new Date(job.appliedDate).toLocaleDateString()}</span>
                </div>
                {job.notes && (
                  <div className="flex items-start gap-2 text-sm text-surface-500 dark:text-surface-500 bg-surface-50 dark:bg-surface-900/50 p-3 rounded-lg border border-surface-100 dark:border-surface-700">
                    <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{job.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-800 rounded-2xl w-full max-w-md shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                {editingJob ? 'Edit Job Application' : 'Add New Job'}
              </h3>
              <button onClick={closeModal} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="job-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Company *</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Job Title *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Notes (Optional)</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 flex justify-end gap-3 mt-auto">
              <button 
                type="button" 
                onClick={closeModal}
                className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="job-form"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                {editingJob ? 'Save Changes' : 'Add Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
