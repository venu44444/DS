import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Edit3, Trash2, Eye, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useProgress } from '../../context/ProgressContext';

export default function ExperimentCard({ experiment, onEdit, onDelete, showActions = true }) {
  const { getModuleById, getToolsForExperiment } = useData();
  const { getExperimentProgress } = useProgress();
  const navigate = useNavigate();

  const mod = getModuleById(experiment.moduleId);
  const tools = getToolsForExperiment(experiment);
  const progress = getExperimentProgress(experiment.id);

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  return (
    <div className="group relative rounded-2xl border border-portal-border bg-portal-card p-5 sm:p-6 glass-card shadow-glass flex flex-col justify-between hover:border-portal-border-strong transition-all duration-200">
      <div>
        {/* Top Header: Experiment Number & Difficulty Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-portal-primary tracking-wider uppercase">
            EXPERIMENT {experiment.number}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(experiment.difficulty)}`}>
            {experiment.difficulty || 'Intermediate'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-portal-text group-hover:text-portal-primary transition-colors line-clamp-2 leading-snug">
          {experiment.title}
        </h3>

        {/* Exactly 15-word Description */}
        <p className="text-xs text-portal-text-muted mt-2.5 leading-relaxed line-clamp-3">
          {experiment.description}
        </p>

        {/* Module Badge */}
        <div className="mt-4 pt-3 border-t border-portal-border/50 flex items-center justify-between text-xs">
          <Link
            to={`/modules/${mod.id}`}
            className="text-[11px] font-semibold text-portal-text-muted hover:text-portal-primary transition-colors truncate max-w-[200px]"
          >
            {mod.title}
          </Link>
          <span className="text-[10px] font-mono font-medium text-portal-primary">
            {progress.completed}/{progress.total} Completed
          </span>
        </div>

        {/* Tool Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tools.slice(0, 4).map((tool) => (
            <span
              key={tool.id}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-portal-bg-secondary border border-portal-border text-portal-text-muted"
            >
              {tool.name}
            </span>
          ))}
          {tools.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-portal-bg-secondary border border-portal-border text-portal-text-muted">
              +{tools.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-portal-border/60 flex items-center justify-between gap-2">
        <Link
          to={`/experiments/${experiment.id}/overview`}
          className="flex items-center gap-1.5 text-xs font-bold text-portal-primary hover:text-portal-primary-hover group-hover:translate-x-0.5 transition-all"
        >
          <span>Overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {showActions && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit && onEdit(experiment)}
              className="p-1.5 rounded-lg text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary transition-colors"
              title="Edit experiment"
              aria-label={`Edit ${experiment.title}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(experiment)}
              className="p-1.5 rounded-lg text-portal-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete experiment"
              aria-label={`Delete ${experiment.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
