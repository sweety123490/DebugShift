import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CodeViewer from '../components/CodeViewer';
import EvaluationReport from '../components/EvaluationReport';
import {
  Terminal,
  Bug,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Send,
  RotateCcw,
  Sparkles,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileCode2,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChallengeWorkspacePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Workspace editor state
  const [fixedCode, setFixedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [revealedHintIndex, setRevealedHintIndex] = useState(0);

  // Evaluation submission state
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/challenges/${id}`);
      if (res.data.success) {
        const c = res.data.challenge;
        setChallenge(c);
        setFixedCode(c.brokenCode || '');
        setExplanation('');
        setEvaluationResult(null);
      }
    } catch (err) {
      console.error('Error loading challenge:', err);
      toast.error('Failed to load challenge details.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetCode = () => {
    if (challenge) {
      setFixedCode(challenge.brokenCode);
      toast.success('Code reset to original broken snippet.');
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();

    if (!fixedCode.trim()) {
      toast.error('Please write your fixed code before submitting.');
      return;
    }

    if (!explanation.trim() || explanation.trim().length < 15) {
      toast.error('Please provide a descriptive root cause explanation (at least 15 characters).');
      return;
    }

    try {
      setEvaluating(true);
      const res = await api.post('/submissions/evaluate', {
        challengeId: challenge._id,
        fixedCode,
        explanation,
      });

      if (res.data.success) {
        setEvaluationResult(res.data.submission);
        toast.success(`Evaluation complete! Score: ${res.data.submission.score}/100`);
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      const msg = err.response?.data?.message || 'Error occurred while evaluating solution.';
      toast.error(msg);
    } finally {
      setEvaluating(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
        <p className="text-sm">Preparing debugging workspace...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Challenge Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested challenge does not exist or may have been removed.
        </p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dark-700/80">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white border border-dark-700 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/20">
                {challenge.category}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                  challenge.difficulty
                )}`}
              >
                {challenge.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Est: {challenge.estimatedMinutes || 15} mins
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Status / Mode Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-dark-800 border border-dark-700 text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
            <span>Live Workspace Session</span>
          </span>
        </div>
      </div>

      {/* If Evaluation Result exists, display Evaluation Report View */}
      {evaluationResult ? (
        <EvaluationReport
          evaluation={evaluationResult}
          challengeTitle={challenge.title}
          onRetry={() => setEvaluationResult(null)}
        />
      ) : (
        /* Split Screen Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Challenge Details & Broken Code (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Problem Description Card */}
            <div className="glass-card rounded-2xl p-5 border border-dark-700 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Bug className="w-4 h-4 text-rose-400" />
                <span>Problem Description</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {challenge.description}
              </p>

              {/* Expected Behavior Box */}
              <div className="p-3.5 rounded-xl bg-brand-cyan/5 border border-brand-cyan/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Expected Behavior:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {challenge.expectedBehavior}
                </p>
              </div>
            </div>

            {/* Original Broken Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 px-1 font-semibold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Original Broken Code:</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal">Read-only reference</span>
              </div>
              <CodeViewer
                code={challenge.brokenCode}
                language={challenge.language || 'javascript'}
                filename={`${challenge.slug}.js`}
                maxHeight="max-h-[360px]"
              />
            </div>

            {/* Bug Hints Toggle / Accordion */}
            {challenge.hints && challenge.hints.length > 0 && (
              <div className="glass-card rounded-2xl border border-dark-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="w-full flex items-center justify-between p-4 bg-dark-800/80 hover:bg-dark-800 text-xs font-bold text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2 text-brand-amber">
                    <Lightbulb className="w-4 h-4" />
                    <span>Need a Hint? ({challenge.hints.length} hints available)</span>
                  </div>
                  {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showHints && (
                  <div className="p-4 bg-dark-850 border-t border-dark-700 space-y-3">
                    <div className="space-y-2.5">
                      {challenge.hints.map((hint, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-dark-800 border border-dark-700/60 text-xs text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-brand-amber/20 text-brand-amber flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{hint}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Solution Submission & Explanation (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <form onSubmit={handleSubmitSolution} className="glass-card rounded-2xl p-6 border border-dark-700 shadow-xl space-y-5">
              {/* Top Editor Header */}
              <div className="flex items-center justify-between pb-3 border-b border-dark-700">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-bold text-white">Your Solution Editor</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-dark-700 text-xs transition-colors"
                  title="Reset to broken snippet"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Reset Code</span>
                </button>
              </div>

              {/* Code Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Corrected Code (Monospace Editor)
                </label>
                <div className="relative rounded-xl overflow-hidden border border-dark-700 focus-within:border-brand-primary bg-dark-900 transition-colors">
                  <textarea
                    value={fixedCode}
                    onChange={(e) => setFixedCode(e.target.value)}
                    rows={13}
                    placeholder="// Write your corrected code implementation here..."
                    className="w-full p-4 font-mono text-xs sm:text-sm text-slate-100 bg-transparent resize-y focus:outline-none leading-relaxed selection:bg-brand-primary/40"
                    spellCheck="false"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Edit the snippet above to fix the bug without breaking existing specifications.
                </p>
              </div>

              {/* Explanation Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Root Cause Diagnosis & Technical Explanation (30% Score Weight)
                  </label>
                  <span className="text-[11px] text-brand-secondary font-mono">
                    {explanation.length} characters
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-dark-700 focus-within:border-brand-primary bg-dark-900 transition-colors">
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={5}
                    placeholder="Structure your interview response:&#10;1. What is the bug?&#10;2. Why does it happen at runtime?&#10;3. How does your fix solve it without side-effects?"
                    className="w-full p-3.5 text-xs sm:text-sm text-slate-100 bg-transparent resize-y focus:outline-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <Sparkles className="w-3 h-3 text-brand-primary flex-shrink-0" />
                  <span>Explain the <em>What</em>, <em>Why</em>, and <em>How</em> for highest rubric score.</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="w-full sm:w-auto text-xs text-slate-400 hover:text-brand-amber transition-colors flex items-center justify-center gap-1.5 py-2"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHints ? 'Hide Hints' : 'Toggle Hints'}</span>
                </button>

                <button
                  type="submit"
                  disabled={evaluating}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all disabled:opacity-60 hover:scale-[1.01]"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini AI Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Solution for AI Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
