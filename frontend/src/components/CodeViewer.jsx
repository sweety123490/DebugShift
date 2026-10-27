import React, { useState } from 'react';
import { Copy, Check, FileCode2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CodeViewer({
  code,
  language = 'javascript',
  filename = 'BrokenComponent.js',
  showLineNumbers = true,
  maxHeight = 'max-h-[500px]',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = (code || '').trim().split('\n');

  return (
    <div className="rounded-xl overflow-hidden border border-dark-700 bg-dark-900 shadow-xl flex flex-col font-mono text-xs">
      {/* Top Editor Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-800 border-b border-dark-700 select-none">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <FileCode2 className="w-3.5 h-3.5 text-brand-secondary" />
          <span className="text-xs font-semibold text-slate-200">{filename}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-700 text-slate-400 uppercase tracking-wider">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-700/60 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-brand-emerald" />
              <span className="text-brand-emerald">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className={`overflow-auto p-4 ${maxHeight} text-slate-200 text-xs leading-relaxed selection:bg-brand-primary/40`}>
        <pre className="flex">
          {showLineNumbers && (
            <div className="select-none pr-4 text-right text-slate-600 font-mono border-r border-dark-700/60">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <div className={`${showLineNumbers ? 'pl-4' : ''} flex-1 overflow-x-auto whitespace-pre font-mono`}>
            {lines.map((line, i) => (
              <div key={i} className="hover:bg-dark-800/40 px-1 -mx-1 rounded transition-colors">
                {line || ' '}
              </div>
            ))}
          </div>
        </pre>
      </div>
    </div>
  );
}
