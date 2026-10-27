import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Info, AlertTriangle } from 'lucide-react';
import { runPythonCode } from '../../utils/pythonRunner';
import OutputViewer from './OutputViewer';

export default function Sandbox({ initialCode, expectedOutput, chart }) {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState(expectedOutput || '');
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [runMetadata, setRunMetadata] = useState({ isDemo: true, isEdited: false });
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(initialCode || '');
    setOutput(expectedOutput || '');
    setError(null);
    setRunMetadata({ isDemo: true, isEdited: false });
  }, [initialCode, expectedOutput]);

  const handleKeyDown = (e) => {
    // Tab indents with 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
    // Ctrl+Enter or Cmd+Enter runs code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const result = await runPythonCode({
        code,
        originalCode: initialCode,
        expectedOutput,
      });

      setOutput(result.stdout || '');
      setError(result.error || null);
      setRunMetadata({
        isDemo: Boolean(result.isDemo),
        isEdited: Boolean(result.isEdited),
      });
    } catch (err) {
      setError(`Execution runtime error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode || '');
    setOutput(expectedOutput || '');
    setError(null);
    setRunMetadata({ isDemo: true, isEdited: false });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBackendConnected = Boolean(import.meta.env.VITE_PYTHON_API_URL);

  return (
    <div className="space-y-4">
      {/* Honesty Banner: Backend Status */}
      {!isBackendConnected ? (
        <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Demo Mode Active:</span> No Python backend API is currently connected. You can inspect and run the verified baseline benchmark. Code edits perform syntax checks; real arbitrary code execution requires setting <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">VITE_PYTHON_API_URL</code>.
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          <Info className="w-4 h-4 shrink-0" />
          <span>Connected to live Python execution microservice.</span>
        </div>
      )}

      {/* Editor & Execution Container */}
      <div className="rounded-2xl border border-portal-border bg-portal-card overflow-hidden glass-card shadow-glass">
        {/* Editor Controls Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-portal-border bg-portal-bg-secondary/60 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-portal-text tracking-wide">
              INTERACTIVE SANDBOX
            </span>
            <span className="text-[10px] text-portal-text-muted hidden sm:inline">
              (Tab to indent • Ctrl+Enter to run)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-portal-text-muted hover:text-portal-text hover:bg-portal-bg border border-portal-border transition-colors"
              aria-label="Copy sandbox code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-portal-text-muted hover:text-portal-text hover:bg-portal-bg border border-portal-border transition-colors"
              aria-label="Reset code to original template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-all shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Input Textarea */}
        <div className="relative p-2 bg-slate-950 font-mono text-xs">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={10}
            spellCheck="false"
            className="w-full bg-transparent text-slate-100 p-3 font-mono text-xs leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-portal-primary/50 rounded-lg selection:bg-cyan-500/20"
            placeholder="# Write or edit Python code here..."
          />
        </div>
      </div>

      {/* Output Panel Header & Viewer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-portal-text tracking-wide uppercase">
            Execution Output Stream
          </h4>
          {runMetadata.isDemo && runMetadata.isEdited && (
            <span className="text-[11px] text-amber-400 font-medium">
              Modified script (demo mode)
            </span>
          )}
        </div>

        <OutputViewer
          output={output}
          chart={chart}
          isLoading={isRunning}
          error={error}
        />
      </div>
    </div>
  );
}
