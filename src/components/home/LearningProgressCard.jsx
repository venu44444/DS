import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, ArrowRight, BarChart3 } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useData } from '../../context/DataContext';

export default function LearningProgressCard() {
  const { getOverallProgress, getModuleProgress, recentExpIds } = useProgress();
  const { modules, getExperimentById } = useData();

  const overall = getOverallProgress();

  return (
    <div className="rounded-2xl border border-portal-border bg-portal-card p-5 sm:p-6 glass-card shadow-glass space-y-6">
      {/* Overall Progress Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-portal-primary" />
            <span className="text-xs font-bold text-portal-text uppercase tracking-wider">
              Curriculum Progress
            </span>
          </div>
          <span className="font-mono text-sm font-extrabold text-portal-primary">
            {overall.percentage}%
          </span>
        </div>

        {/* Master Progress Bar */}
        <div className="w-full h-2.5 bg-portal-bg-secondary rounded-full overflow-hidden p-[1px] border border-portal-border">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(overall.percentage, 2)}%` }}
          />
        </div>
        <p className="text-[11px] text-portal-text-muted mt-1.5 flex items-center justify-between">
          <span>{overall.completed} of {overall.total} sub-experiments completed</span>
          <span>{overall.total - overall.completed} remaining</span>
        </p>
      </div>

      {/* Per-Module Progress Mini-Bars */}
      <div className="space-y-3 pt-4 border-t border-portal-border/60">
        <span className="text-[11px] font-bold text-portal-text-muted uppercase tracking-wider block">
          Module Completion
        </span>

        <div className="space-y-2.5">
          {modules.map((mod) => {
            const modProg = getModuleProgress(mod.id);
            return (
              <div key={mod.id} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <Link
                    to={`/modules/${mod.id}`}
                    className="font-medium text-portal-text hover:text-portal-primary transition-colors truncate max-w-[240px]"
                  >
                    M{mod.number}: {mod.title}
                  </Link>
                  <span className="font-mono text-[11px] text-portal-text-muted">
                    {modProg.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-portal-bg-secondary rounded-full overflow-hidden border border-portal-border/40">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${modProg.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Experiments Visited */}
      {recentExpIds.length > 0 && (
        <div className="pt-4 border-t border-portal-border/60 space-y-2.5">
          <span className="text-[11px] font-bold text-portal-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Recently Visited
          </span>

          <div className="space-y-1.5">
            {recentExpIds.slice(0, 3).map((expId) => {
              const exp = getExperimentById(expId);
              if (!exp) return null;
              return (
                <Link
                  key={expId}
                  to={`/experiments/${exp.id}/overview`}
                  className="flex items-center justify-between p-2 rounded-xl bg-portal-bg-secondary/60 hover:bg-portal-bg-secondary border border-portal-border hover:border-portal-primary/30 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-portal-primary/10 text-portal-primary font-bold">
                      {exp.number}
                    </span>
                    <span className="text-portal-text group-hover:text-portal-primary font-medium truncate">
                      {exp.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-portal-text-muted group-hover:text-portal-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
