import React, { useState, useMemo } from 'react';
import { Terminal, Table as TableIcon, BarChart2, AlertCircle } from 'lucide-react';
import SvgChart from '../common/SvgChart';

export default function OutputViewer({ output, chart, isLoading = false, error = null }) {
  // Parse tabular data if present
  const parsedTable = useMemo(() => {
    if (!output || typeof output !== 'string') return null;

    const lines = output.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) return null;

    // Pattern 1: Markdown / Pipe tables | Header | Header |
    if (lines.some(l => l.includes('|'))) {
      const dataLines = lines.filter(l => !l.trim().startsWith('---') && !l.trim().startsWith('==='));
      if (dataLines.length >= 2) {
        const headers = dataLines[0].split('|').map(c => c.trim()).filter(Boolean);
        const rows = dataLines.slice(1).map(l => l.split('|').map(c => c.trim()).filter(Boolean));
        if (headers.length > 1 && rows.length > 0 && rows[0].length === headers.length) {
          return { headers, rows };
        }
      }
    }

    // Pattern 2: Key : Value pairs (e.g. item_12 : 144)
    const colonLines = lines.filter(l => l.includes(':') && !l.includes('Traceback'));
    if (colonLines.length >= 2 && colonLines.length >= lines.length - 2) {
      const rows = colonLines.map(l => {
        const parts = l.split(':');
        return [parts[0].trim(), parts.slice(1).join(':').trim()];
      });
      return { headers: ['Property / Key', 'Observed Value'], rows };
    }

    // Pattern 3: Space-aligned columnar DataFrame output
    const cleanLines = lines.filter(l => !l.startsWith('---') && !l.startsWith('===') && !l.includes('dtype:'));
    if (cleanLines.length >= 2) {
      const splitRows = cleanLines.map(l => l.trim().split(/\s{2,}|\t/));
      const colCounts = splitRows.map(r => r.length);
      const firstLen = colCounts[0];
      if (firstLen >= 2 && colCounts.slice(1).every(len => len === firstLen || Math.abs(len - firstLen) <= 1)) {
        return {
          headers: splitRows[0],
          rows: splitRows.slice(1),
        };
      }
    }

    return null;
  }, [output]);

  // Available tabs
  const hasTable = Boolean(parsedTable);
  const hasChart = Boolean(chart && Array.isArray(chart.labels) && chart.labels.length > 0);

  const [activeTab, setActiveTab] = useState('console');

  if (isLoading) {
    return (
      <div className="p-8 border border-portal-border rounded-xl bg-slate-950 flex flex-col items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-portal-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-portal-text-muted">Computing output stream...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-rose-500/30 rounded-xl bg-rose-500/10 text-rose-300 flex items-start gap-3 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
        <div className="flex-1 font-mono whitespace-pre-wrap leading-relaxed">
          {error}
        </div>
      </div>
    );
  }

  if (!output && !hasChart) {
    return (
      <div className="p-8 border border-portal-border rounded-xl bg-portal-card text-center text-xs text-portal-text-muted italic">
        No output generated yet. Run the code or view the sample benchmark.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-portal-border bg-slate-950 overflow-hidden shadow-lg">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'console'
                ? 'bg-portal-primary/20 text-portal-primary border border-portal-primary/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Console
          </button>

          {hasTable && (
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'table'
                  ? 'bg-portal-primary/20 text-portal-primary border border-portal-primary/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table
            </button>
          )}

          {hasChart && (
            <button
              type="button"
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'chart'
                  ? 'bg-portal-primary/20 text-portal-primary border border-portal-primary/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Chart
            </button>
          )}
        </div>

        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SUCCESS
        </span>
      </div>

      {/* Tab Content Panes */}
      <div className="p-4 overflow-x-auto">
        {activeTab === 'console' && (
          <pre className="font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/20">
            {output}
          </pre>
        )}

        {activeTab === 'table' && parsedTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  {parsedTable.headers.map((h, i) => (
                    <th key={i} className="py-2 px-3 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {parsedTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-1.5 px-3 text-slate-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'chart' && hasChart && (
          <div className="py-2">
            <SvgChart chart={chart} />
          </div>
        )}
      </div>
    </div>
  );
}
