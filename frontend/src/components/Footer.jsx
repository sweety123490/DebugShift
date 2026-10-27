import React from 'react';
import { Terminal, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900/90 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Context<span className="text-brand-primary">Shift</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              AI-Powered Technical Interview Bug-Fix Simulator. Built to bridge the gap between algorithmic puzzles and realistic day-to-day software engineering debugging.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-secondary font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Debug Smarter. Think Deeper. Interview Better.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>React Hooks & Lifecycle</li>
              <li>JavaScript Async / Await</li>
              <li>Express.js Middleware</li>
              <li>API Error Handling</li>
              <li>Memory Leaks & Teardown</li>
              <li>State Batching & Immutability</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Project Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-brand-cyan" />
                <span>MERN + Google Gemini 1.5</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-emerald" />
                <span>JWT Authentication & bcryptjs</span>
              </div>
              <p className="pt-2 text-[11px] text-slate-500">
                End-term Capstone Project designed for rapid 48-hour deployment & evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-dark-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ContextShift. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span>Engineered with passion for software craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
