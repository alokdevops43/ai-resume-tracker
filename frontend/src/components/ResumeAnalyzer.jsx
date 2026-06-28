import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, BrainCircuit, Upload } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ResumeAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Auto-trigger analysis for demo purposes since we don't have a resume selection UI yet
  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await api.post('/resume/analyze');
      setResult(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'text-green-500/20';
    if (score >= 60) return 'text-amber-500/20';
    return 'text-red-500/20';
  };

  const getStatusIcon = (status) => {
    if (status === 'excellent' || status === 'good') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (status === 'warning') return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
        <div className="relative">
          <BrainCircuit className="h-16 w-16 text-primary-600 dark:text-primary-400 animate-pulse" />
          <div className="absolute inset-0 border-4 border-t-primary-600 dark:border-t-primary-400 border-primary-200 dark:border-primary-900/30 rounded-full animate-spin"></div>
        </div>
        <h3 className="mt-6 text-xl font-medium text-surface-900 dark:text-white">Analyzing your resume...</h3>
        <p className="mt-2 text-surface-500 dark:text-surface-400 text-center max-w-md">
          Our AI is scanning for keywords, formatting, and industry best practices.
        </p>
      </div>
    );
  }

  if (error) {
    const isMissingResume = error.includes('No resume found');
    return (
      <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800 text-center">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        <p className="font-medium text-lg">{error}</p>
        
        {isMissingResume ? (
          <Link to="/dashboard/upload" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            <Upload className="h-5 w-5" />
            Upload a Resume Now
          </Link>
        ) : (
          <button onClick={handleAnalyze} className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">AI Analysis Results</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Based on our ATS rules engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="lg:col-span-1 bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-6">Overall ATS Score</h3>
          
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className={getScoreBg(result.score)}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={getScoreColor(result.score)}
                strokeDasharray={`${result.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-5xl font-bold", getScoreColor(result.score))}>{result.score}</span>
              <span className="text-sm text-surface-500 dark:text-surface-400 mt-1">/ 100</span>
            </div>
          </div>
          
          <p className="mt-6 text-surface-600 dark:text-surface-300">
            {result.score >= 80 ? 'Excellent! Your resume is highly ATS optimized.' : 
             result.score >= 60 ? 'Good start, but needs some optimization.' : 
             'Needs significant improvement for ATS systems.'}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-6">Category Breakdown</h3>
          <div className="space-y-5">
            {Object.entries(result.categories).map(([key, data]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.status)}
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300 capitalize">{key}</span>
                  </div>
                  <span className="text-sm font-medium text-surface-900 dark:text-white">{data.score}/100</span>
                </div>
                <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2">
                  <div 
                    className={cn("h-2 rounded-full", getScoreColor(data.score).replace('text-', 'bg-'))}
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-surface-600 dark:text-surface-300 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.weaknesses.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-surface-600 dark:text-surface-300 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Missing Industry Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {result.missingKeywords.map((kw, i) => (
            <span key={i} className="px-3 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-full text-sm font-medium border border-surface-200 dark:border-surface-600">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl shadow-sm border border-primary-100 dark:border-primary-900/30 p-6">
        <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100 mb-4">Actionable Suggestions</h3>
        <div className="space-y-4">
          {result.suggestions.map((sug, i) => (
            <div key={i} className="flex items-start gap-3 bg-white dark:bg-surface-800 p-4 rounded-lg border border-primary-100 dark:border-surface-700">
              <ArrowRight className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <p className="text-surface-700 dark:text-surface-300 text-sm">{sug}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
