import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  History,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Cpu,
  Loader2,
  AlertCircle,
  Code2,
} from 'lucide-react';

export default function SubmissionsHistoryPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/submissions/my');
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      }
    } catch (err) {
      console.error('Failed to load submission history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-dark-700">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
              Candidate Track Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-brand-primary" />
            <span>Submission & Evaluation History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review previous technical debugging reports, scores, and interviewer feedback.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-dark-700 text-xs font-semibold transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-3" />
          <p className="text-sm">Fetching evaluation records...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-dark-700 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No submissions recorded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't submitted any challenge solutions yet. Head over to the dashboard to begin your first interview simulation.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-indigo-500 text-white text-xs font-bold transition-colors inline-block"
            >
              Explore Challenges
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="glass-card rounded-2xl p-5 border border-dark-700 hover:border-dark-600 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/20">
                    {sub.challenge?.category || 'General'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {sub.challenge?.difficulty || 'Medium'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(sub.createdAt).toLocaleDateString()} at{' '}
                    {new Date(sub.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-brand-primary transition-colors">
                  {sub.challenge?.title || 'Debugging Challenge'}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-xs">{sub.evaluationProvider || 'AI Engine'}</span>
                </div>
              </div>

              {/* Score & View Action */}
              <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-dark-700">
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-xl font-mono font-extrabold text-sm border ${getScoreBadge(
                      sub.score
                    )}`}
                  >
                    {sub.score} / 100
                  </div>
                </div>

                <Link
                  to={`/submissions/${sub._id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-800 hover:bg-brand-primary text-slate-200 hover:text-white text-xs font-semibold border border-dark-700 hover:border-transparent transition-all shadow-sm"
                >
                  <span>View Feedback</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
