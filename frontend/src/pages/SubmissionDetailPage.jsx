import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import EvaluationReport from '../components/EvaluationReport';
import CodeViewer from '../components/CodeViewer';
import {
  ArrowLeft,
  FileCode,
  MessageSquare,
  Loader2,
  AlertTriangle,
  History,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/submissions/${id}`);
      if (res.data.success) {
        setSubmission(res.data.submission);
      }
    } catch (err) {
      console.error('Failed to load submission report:', err);
      toast.error('Unable to retrieve submission details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
        <p className="text-sm">Retrieving submission evaluation report...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Submission Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          This submission does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/submissions"
          className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold"
        >
          Return to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-dark-700">
        <Link
          to="/submissions"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submission History</span>
        </Link>

        {submission.challenge?._id && (
          <Link
            to={`/challenge/${submission.challenge._id}`}
            className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
          >
            Open Challenge in Workspace &rarr;
          </Link>
        )}
      </div>

      {/* Main AI Evaluation Report Component */}
      <EvaluationReport
        evaluation={submission}
        challengeTitle={submission.challenge?.title || 'Challenge'}
      />

      {/* Candidate's Submitted Work Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-dark-700">
        {/* Submitted Fixed Code */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <FileCode className="w-4 h-4 text-brand-primary" />
            <span>Your Submitted Code</span>
          </div>
          <CodeViewer
            code={submission.fixedCode}
            language="javascript"
            filename="YourSubmittedFix.js"
            maxHeight="max-h-[380px]"
          />
        </div>

        {/* Submitted Explanation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-brand-secondary" />
            <span>Your Root Cause Diagnosis</span>
          </div>
          <div className="glass-card rounded-xl p-5 border border-dark-700 min-h-[200px] text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-dark-900/60">
            {submission.explanation}
          </div>
        </div>
      </div>
    </div>
  );
}
