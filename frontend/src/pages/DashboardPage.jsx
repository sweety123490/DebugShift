import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Terminal,
  Trophy,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Code2,
  Sparkles,
  BarChart3,
  Flame,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = [
    'All',
    'React Hooks',
    'JavaScript Async/Await',
    'Express Middleware',
    'API Error Handling',
    'Memory Leaks',
    'State Management',
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, challengesRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/challenges'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
      if (challengesRes.data.success) {
        setChallenges(challengesRes.data.challenges);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter challenges locally by category, difficulty, search
  const filteredChallenges = challenges.filter((c) => {
    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesSearch =
      !search.trim() ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-dark-700 bg-white dark:bg-gradient-to-r dark:from-dark-800 dark:via-dark-850 dark:to-dark-900 shadow-lg relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/20 text-brand-primary border border-brand-primary/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Technical Interview Lab
              </span>
              <span className="text-xs text-slate-400 font-mono">v1.0.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">{user?.name || 'Engineer'}</span>! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sharpen your real-world debugging reflexes. Inspect broken production snippets, diagnose the root cause, and receive instant AI evaluation.
            </p>
          </div>

          {/* Quick Start Debugging CTA */}
          {challenges.length > 0 && (
            <Link
              to={`/challenge/${challenges[0]._id}`}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all hover:scale-[1.02]"
            >
              <Terminal className="w-4 h-4" />
              <span>Start Debugging</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Challenges */}
        <div className="glass-card rounded-xl p-5 border border-dark-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Challenges
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.stats?.totalChallenges ?? challenges.length}
            </span>
            <span className="text-xs text-slate-400">Available</span>
          </div>
        </div>

        {/* Challenges Completed */}
        <div className="glass-card rounded-xl p-5 border border-dark-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.stats?.challengesCompleted ?? 0}
            </span>
            <span className="text-xs text-brand-emerald font-semibold">
              {stats?.stats?.completionRate ?? 0}% completed
            </span>
          </div>
        </div>

        {/* Average AI Score */}
        <div className="glass-card rounded-xl p-5 border border-dark-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average AI Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.stats?.averageScore ?? 0}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="glass-card rounded-xl p-5 border border-dark-700/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Evaluations
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {stats?.stats?.totalSubmissionsCount ?? 0}
            </span>
            <span className="text-xs text-slate-400">Submitted</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Left Filter & Challenge Grid + Right Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filters and Challenge Cards (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters Bar */}
          <div className="glass-card rounded-xl p-4 border border-dark-700 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search challenges by title, category, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-dark-800 border border-slate-300 dark:border-dark-700 focus:border-brand-primary text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-brand-primary" />
                <span>Category:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25 scale-[1.02]'
                        : 'bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-700/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-dark-700/50">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Difficulty:
              </span>
              <div className="flex items-center gap-1.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge Cards Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-3" />
              <p className="text-sm">Loading debugging challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-dark-700 space-y-3 shadow-sm">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No challenges found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No debugging challenges match your current search and filter settings.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                }}
                className="mt-2 px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-indigo-600 text-xs font-semibold shadow-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChallenges.map((challenge) => (
                <Link
                  key={challenge._id}
                  to={`/challenge/${challenge._id}`}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-slate-200 dark:border-dark-700 hover:border-brand-primary/60 dark:hover:border-brand-primary/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer text-left block"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-brand-secondary bg-brand-secondary/10 px-2.5 py-0.5 rounded border border-brand-secondary/20">
                        {challenge.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors line-clamp-1">
                      {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-dark-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{challenge.estimatedMinutes || 15} mins</span>
                    </div>

                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary/10 group-hover:bg-brand-primary text-brand-primary group-hover:text-white transition-all shadow-sm">
                      <span>Start Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Submissions Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-dark-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-700">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-primary" />
                <span>Recent Submissions</span>
              </h3>
              <Link
                to="/submissions"
                className="text-[11px] font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
              >
                View All
              </Link>
            </div>

            {(!stats?.recentSubmissions || stats.recentSubmissions.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <p>No submissions recorded yet.</p>
                <p className="text-[11px] text-slate-400">
                  Pick a challenge on the left to test your debugging skills!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentSubmissions.map((sub) => (
                  <Link
                    key={sub._id}
                    to={`/submissions/${sub._id}`}
                    className="block p-3 rounded-xl bg-dark-800/60 hover:bg-dark-800 border border-dark-700/60 hover:border-dark-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">
                        {sub.challenge?.title || 'Challenge'}
                      </span>
                      <span
                        className={`text-xs font-extrabold font-mono px-1.5 py-0.5 rounded ${
                          sub.score >= 70
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {sub.score}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      <span className="text-brand-primary">View Feedback &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tips Box */}
          <div className="rounded-2xl p-5 border border-brand-primary/20 bg-brand-primary/5 space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Interview Rubric Tip</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              In ContextShift, your explanation counts for <strong className="text-slate-200">30%</strong> of your score! Always articulate <em>what</em> the bug was and <em>why</em> your fix prevents regressions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
