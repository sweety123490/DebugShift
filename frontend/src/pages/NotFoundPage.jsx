import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary flex items-center justify-center mb-6">
        <Terminal className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-brand-secondary uppercase tracking-widest mb-2">
        Error 404: Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        Page Lost in the Runtime Stack
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The route you are navigating to does not exist, has been shifted, or is currently unhandled by the router.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-semibold border border-dark-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
