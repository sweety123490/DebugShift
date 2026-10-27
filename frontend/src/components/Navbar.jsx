import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Terminal,
  Code2,
  History,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-dark-700/80 bg-white/95 dark:bg-dark-900/85 backdrop-blur-md shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent p-0.5 shadow-lg shadow-brand-primary/20 group-hover:shadow-brand-primary/40 transition-all duration-300">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                isDark ? 'bg-dark-900' : 'bg-white'
              }`}>
                <Terminal className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-tight transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Context<span className="text-brand-primary">Shift</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-mono -mt-1 font-semibold">
                Bug-Fix Simulator
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-dark-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/submissions"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/submissions')
                      ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-dark-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Submission History
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-brand-primary font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-dark-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Features
                </Link>
              </>
            )}
          </div>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-700 transition-all duration-200 shadow-sm flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700 text-xs text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></div>
                  <User className="w-3.5 h-3.5 text-brand-secondary" />
                  <span className="font-medium text-slate-200">{user?.name || 'Developer'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-primary to-brand-accent hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu and theme buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 focus:outline-none border border-dark-700"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-brand-primary" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-850 border-b border-dark-700 px-4 pt-3 pb-5 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="py-2 border-b border-dark-700 text-sm text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-secondary" />
                <span>Signed in as <strong className="text-white">{user?.name}</strong></span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-dark-800"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                Dashboard
              </Link>
              <Link
                to="/submissions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-dark-800"
              >
                <History className="w-4 h-4 text-brand-secondary" />
                Submission History
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-medium text-slate-300 hover:text-white bg-dark-800 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
