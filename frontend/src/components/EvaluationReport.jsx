import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Code2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeViewer from './CodeViewer';

export default function EvaluationReport({ evaluation, onRetry, challengeTitle }) {
  const [showCanonicalFix, setShowCanonicalFix] = useState(false);

  if (!evaluation) return null;

  const {
    score = 0,
    scoresByCategory = {},
    feedback = '',
    correctnessAnalysis = '',
    suggestions = [],
    expectedFixSnippet = '',
    evaluationProvider = 'Google Gemini 1.5',
  } = evaluation;

  const {
    codeCorrectness = 0,
    rootCauseUnderstanding = 0,
    codeQuality = 0,
  } = scoresByCategory;

  // Score color grading
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-brand-emerald border-brand-emerald/40 bg-brand-emerald/10';
    if (val >= 60) return 'text-brand-amber border-brand-amber/40 bg-brand-amber/10';
    return 'text-brand-rose border-brand-rose/40 bg-brand-rose/10';
  };

  const getScoreBadge = (val) => {
    if (val >= 85) return 'Exceptional Debugging';
    if (val >= 70) return 'Passed Evaluation';
    if (val >= 50) return 'Partial Fix Achieved';
    return 'Needs Revision';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-dark-700 bg-gradient-to-br from-dark-800/90 via-dark-850 to-dark-900 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                <Sparkles className="w-3.5 h-3.5" />
                AI Interview Assessment
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {challengeTitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Debugging Evaluation Report
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Evaluated by: <strong className="text-slate-200">{evaluationProvider}</strong></span>
            </div>
          </div>

          {/* Overall Score Dial / Badge */}
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 ${getScoreColor(score)} shadow-xl`}>
              <span className="text-4xl font-extrabold tracking-tight">{score}</span>
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Out of 100</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-slate-200">Outcome Status:</span>
              <span className="text-base font-bold text-white">{getScoreBadge(score)}</span>
              <span className="text-xs text-slate-400 mt-0.5">Threshold: 70/100 to pass</span>
            </div>
          </div>
        </div>

        {/* 3 Rubric Score Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-dark-700/80">
          {/* 1. Code Correctness (0-50) */}
          <div className="bg-dark-800/80 rounded-xl p-4 border border-dark-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Code Correctness</span>
              <span className="text-xs font-bold font-mono text-brand-cyan">
                {codeCorrectness} / 50 pts
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-cyan h-2 rounded-full transition-all duration-500"
                style={{ width: `${(codeCorrectness / 50) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Bug resolution & runtime accuracy (Weight: 50%)
            </p>
          </div>

          {/* 2. Root Cause Understanding (0-30) */}
          <div className="bg-dark-800/80 rounded-xl p-4 border border-dark-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Root Cause Depth</span>
              <span className="text-xs font-bold font-mono text-brand-secondary">
                {rootCauseUnderstanding} / 30 pts
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(rootCauseUnderstanding / 30) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Conceptual diagnosis & explanation (Weight: 30%)
            </p>
          </div>

          {/* 3. Code Quality (0-20) */}
          <div className="bg-dark-800/80 rounded-xl p-4 border border-dark-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Code Quality & Style</span>
              <span className="text-xs font-bold font-mono text-brand-accent">
                {codeQuality} / 20 pts
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${(codeQuality / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Clean idioms & modern best practices (Weight: 20%)
            </p>
          </div>
        </div>
      </div>

      {/* Main Feedback & Correctness Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Feedback */}
        <div className="glass-card rounded-xl p-6 border border-dark-700 space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <Award className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Interviewer Summary Feedback
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-dark-800/50 p-4 rounded-lg border border-dark-700/50">
            {feedback}
          </p>
        </div>

        {/* Correctness Analysis */}
        <div className="glass-card rounded-xl p-6 border border-dark-700 space-y-3">
          <div className="flex items-center gap-2 text-brand-cyan">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Correctness & Technical Analysis
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-dark-800/50 p-4 rounded-lg border border-dark-700/50">
            {correctnessAnalysis}
          </p>
        </div>
      </div>

      {/* Actionable Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="glass-card rounded-xl p-6 border border-dark-700">
          <div className="flex items-center gap-2 text-brand-amber mb-4">
            <Lightbulb className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Suggestions for Continuous Improvement
            </h3>
          </div>
          <ul className="space-y-2.5">
            {suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-slate-300 bg-dark-800/40 p-3 rounded-lg border border-dark-700/40"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-amber/10 text-brand-amber flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Canonical Expected Solution Toggle */}
      {expectedFixSnippet && (
        <div className="border border-dark-700 rounded-xl overflow-hidden bg-dark-850">
          <button
            onClick={() => setShowCanonicalFix(!showCanonicalFix)}
            className="w-full flex items-center justify-between p-4 bg-dark-800/90 hover:bg-dark-800 text-slate-200 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <Code2 className="w-4 h-4 text-brand-primary" />
              <span>Inspect Reference Fix & Benchmark Implementation</span>
            </div>
            {showCanonicalFix ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showCanonicalFix && (
            <div className="p-4 border-t border-dark-700 bg-dark-900">
              <p className="text-xs text-slate-400 mb-3">
                This is the standard engineering solution benchmark used by the AI evaluator to verify correctness and best practices.
              </p>
              <CodeViewer
                code={expectedFixSnippet}
                language="javascript"
                filename="CanonicalReferenceFix.js"
                maxHeight="max-h-[380px]"
              />
            </div>
          )}
        </div>
      )}

      {/* Actions: Retry Challenge or Return to Dashboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dark-700">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 text-sm font-medium border border-dark-700 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-brand-primary/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again / Refine Fix
          </button>
        )}
      </div>
    </div>
  );
}
