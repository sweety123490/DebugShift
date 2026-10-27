import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Terminal,
  Sparkles,
  Bug,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const categories = [
    {
      title: 'React Hooks & Lifecycle',
      desc: 'Stale closures, infinite re-render loops, missed dependencies in useEffect and useCallback.',
      tag: 'React.js',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    },
    {
      title: 'JavaScript Async / Await',
      desc: 'Unhandled promise rejections, hanging request pipelines, and race conditions.',
      tag: 'Async JS',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    },
    {
      title: 'Express.js Middleware',
      desc: 'Double next() calls, ERR_HTTP_HEADERS_SENT errors, and broken error middleware propagation.',
      tag: 'Node / Express',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Memory Leaks & Teardown',
      desc: 'Dangling DOM event listeners, un-cleared intervals, and unmounted async subscriptions.',
      tag: 'Performance',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    },
    {
      title: 'API Error Handling',
      desc: 'Silent 404/500 fetch errors, unchecked HTTP response status, and missing fallback states.',
      tag: 'REST APIs',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    },
    {
      title: 'State Batching & Mutation',
      desc: 'Direct state mutations with array.push, lost batching increments, and missing re-renders.',
      tag: 'State Management',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-primary/20 via-brand-secondary/15 to-brand-cyan/10 blur-[130px] rounded-full pointer-events-none -z-10 opacity-30 dark:opacity-100"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-brand-accent/15 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30 dark:opacity-100"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-dark-800/90 border border-brand-primary/30 text-xs font-semibold text-brand-secondary shadow-md dark:shadow-lg dark:shadow-brand-primary/10 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>AI-Powered Technical Interview Bug-Fix Simulator</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Debug Smarter.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-cyan">
              Think Deeper.
            </span>{' '}
            Interview Better.
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Real technical interviews aren't just memorizing algorithm puzzles. Real engineering is diagnosing broken production code, identifying root causes, and explaining your fix with precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <Terminal className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Start Debugging Now</span>
              <ArrowRight className="w-4 h-4 ml-1 text-white" />
            </Link>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-dark-700 hover:border-slate-400 dark:hover:border-slate-500 shadow-sm transition-all"
            >
              <span>Explore Challenges</span>
            </Link>
          </div>

          {/* Proof metrics / pills */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>8+ Pre-seeded Production Scenarios</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-primary" />
              <span>Google Gemini AI Evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-brand-cyan" />
              <span>Weighted Senior Rubric (50/30/20)</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-dark-750 bg-white/70 dark:bg-dark-850/60 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              Structured Simulation Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How ContextShift Simulates Real Senior Interviews
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              A 3-step structured loop modeled after technical bug-fixing interviews at tier-1 tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-7 border border-slate-200 dark:border-dark-700/80 hover:border-brand-primary/50 shadow-sm hover:shadow-md transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inspect Broken Code</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive authentic broken snippets from React hooks, Express middleware, or async pipelines with bug descriptions and expected behavior.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-7 border border-slate-200 dark:border-dark-700/80 hover:border-brand-secondary/50 shadow-sm hover:shadow-md transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="w-5 h-5 text-brand-secondary" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fix & Explain Root Cause</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Write your corrected code and explain <em>what</em> the bug is, <em>why</em> it happens in the JS runtime, and <em>how</em> your solution addresses it.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-7 border border-slate-200 dark:border-dark-700/80 hover:border-brand-cyan/50 shadow-sm hover:shadow-md transition-all relative group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-brand-cyan font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-brand-cyan" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant AI Rubric Score</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get scored out of 100 on code correctness (50 pts), root-cause comprehension (30 pts), and code quality (20 pts) with actionable senior feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-dark-750">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
              Core Technical Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Targeted Debugging Categories
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              Each track tests specific conceptual gotchas commonly asked during Senior and Mid-Level frontend & full-stack interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-dark-700/70 hover:border-slate-300 dark:hover:border-dark-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border ${cat.color}`}>
                      {cat.tag}
                    </span>
                    <Code2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-dark-700/50 mt-6 flex items-center justify-between text-xs font-semibold text-brand-primary">
                  <span>Available in Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Sample Evaluation Preview Card */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-dark-750 bg-white/70 dark:bg-dark-850/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest">
              Sample AI Output
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              What Senior-Level AI Evaluation Looks Like
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Not just a binary pass/fail test. ContextShift gives you qualitative feedback on your architectural thinking.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-850 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-dark-700 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-dark-700 pb-6">
              <div>
                <span className="text-xs font-mono font-semibold text-brand-primary">Sample Evaluation: React useEffect Stale Closure</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Alex's Interview Submission</h4>
              </div>
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                <span className="text-2xl font-extrabold">92</span>
                <div className="text-[10px] uppercase font-bold tracking-wider leading-tight">
                  <div>Score</div>
                  <div>/ 100</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-dark-800 p-3 rounded-lg border border-slate-200 dark:border-dark-700">
                <div className="text-slate-500 dark:text-slate-400 mb-1 font-medium">Code Correctness</div>
                <div className="text-cyan-600 dark:text-brand-cyan font-bold font-mono text-sm">48 / 50 pts</div>
              </div>
              <div className="bg-slate-50 dark:bg-dark-800 p-3 rounded-lg border border-slate-200 dark:border-dark-700">
                <div className="text-slate-500 dark:text-slate-400 mb-1 font-medium">Root Cause Explanation</div>
                <div className="text-brand-secondary font-bold font-mono text-sm">26 / 30 pts</div>
              </div>
              <div className="bg-slate-50 dark:bg-dark-800 p-3 rounded-lg border border-slate-200 dark:border-dark-700">
                <div className="text-slate-500 dark:text-slate-400 mb-1 font-medium">Code Quality</div>
                <div className="text-purple-600 dark:text-brand-accent font-bold font-mono text-sm">18 / 20 pts</div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-dark-800/80 p-4 rounded-xl border border-slate-200 dark:border-dark-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <strong className="text-slate-900 dark:text-white block font-semibold">Senior Interviewer Feedback:</strong>
              <p className="leading-relaxed">
                "Excellent diagnosis of the stale closure within the setInterval callback. You correctly identified that an empty dependency array causes the callback to capture initial render state, and resolved it elegantly using functional state updates (setSeconds(prev =&gt; prev + 1))."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-dark-700 bg-gradient-to-b from-white to-slate-100 dark:from-dark-850 dark:to-dark-900 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Accelerate Your Debugging Skills?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Join ContextShift today and transform how you approach technical interview problem solving.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-brand-primary to-brand-accent hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all"
            >
              <Terminal className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Launch Simulator Workspace</span>
              <ArrowRight className="w-4 h-4 ml-1 text-white" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
