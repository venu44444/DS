import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle2, Clock, BookOpen, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useProgress } from '../context/ProgressContext';
import ArchitectureDiagram from '../components/experiments/ArchitectureDiagram';

export default function ExperimentOverviewPage() {
  const { experimentId } = useParams();
  const { getExperimentById, getModuleById, getToolsForExperiment } = useData();
  const { isSubExperimentCompleted, getExperimentProgress, recordRecentExperiment } = useProgress();
  const navigate = useNavigate();

  const experiment = getExperimentById(experimentId);

  useEffect(() => {
    if (experiment) {
      recordRecentExperiment(experiment.id);
    }
  }, [experiment, recordRecentExperiment]);

  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-400 w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-portal-text">Experiment Not Found</h2>
        <p className="text-xs text-portal-text-muted">
          The requested experiment ID "{experimentId}" does not exist in the curriculum.
        </p>
        <Link
          to="/experiments"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-portal-primary text-slate-950 mt-4"
        >
          Return to All Experiments
        </Link>
      </div>
    );
  }

  const mod = getModuleById(experiment.moduleId);
  const tools = getToolsForExperiment(experiment);
  const progress = getExperimentProgress(experiment.id);
  const subExperiments = experiment.subExperiments || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-portal-text-muted flex-wrap">
        <Link to="/" className="hover:text-portal-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/experiments" className="hover:text-portal-primary transition-colors">
          Experiments
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-portal-text truncate">
          Experiment {experiment.number}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-3xl border border-portal-border bg-gradient-to-br from-portal-card/90 via-portal-bg-secondary/60 to-portal-card/90 p-6 sm:p-8 glass-card shadow-glass relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-lg bg-portal-primary/10 text-portal-primary border border-portal-primary/20 tracking-wider uppercase">
              EXPERIMENT {experiment.number}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-portal-bg-secondary border border-portal-border text-portal-text-muted">
              {experiment.difficulty}
            </span>
          </div>

          {/* Module Link */}
          <Link
            to={`/modules/${mod.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-portal-primary hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Module {mod.number}: {mod.title}</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-portal-text tracking-tight uppercase leading-tight">
          {experiment.title}
        </h1>

        <p className="text-xs sm:text-sm text-portal-text-muted max-w-3xl leading-relaxed">
          {experiment.description}
        </p>

        {/* Experiment Stats Bar */}
        <div className="pt-4 border-t border-portal-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">
              Sub-Experiments
            </span>
            <span className="font-mono text-base font-bold text-portal-text">
              {subExperiments.length} Parts (A-{subExperiments[subExperiments.length - 1]?.id || 'F'})
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">
              Lab Progress
            </span>
            <span className="font-mono text-base font-bold text-portal-primary">
              {progress.percentage}% ({progress.completed}/{progress.total})
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block mb-1">
              Required Tools
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tools.map((t) => (
                <Link
                  key={t.id}
                  to={`/tools/${t.id}`}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-portal-bg-secondary hover:bg-portal-card border border-portal-border hover:border-portal-primary/30 text-portal-text transition-colors"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Expected Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3">
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-portal-primary" />
            Theoretical Framework & Summary
          </h2>
          <p className="text-xs sm:text-sm text-portal-text-muted leading-relaxed">
            {experiment.overview?.summary || 'Standard data science experiment.'}
          </p>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3">
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-portal-primary" />
            Learning Outcomes
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-portal-text-muted">
            {(experiment.overview?.outcomes || []).map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-portal-teal shrink-0 mt-0.5" />
                <span className="leading-snug">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Animated Architecture Diagram */}
      <ArchitectureDiagram stages={experiment.overview?.architecture || []} />

      {/* Sub-Experiments Grid (A-F) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-portal-border pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-portal-text uppercase tracking-wider">
              Sub-Experiment Procedures ({subExperiments.length})
            </h2>
            <p className="text-xs text-portal-text-muted mt-0.5">
              Select any sub-experiment to examine aim, procedures, code, output and interactive sandbox
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subExperiments.map((sub) => {
            const isCompleted = isSubExperimentCompleted(experiment.id, sub.id);
            return (
              <Link
                key={sub.id}
                to={`/experiments/${experiment.id}/${sub.id}`}
                className="group relative rounded-2xl border border-portal-border bg-portal-card p-5 glass-card shadow-glass flex flex-col justify-between hover:border-portal-primary/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-portal-bg-secondary text-portal-primary border border-portal-border">
                      PART {sub.id}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-portal-text-muted bg-portal-bg-secondary px-2 py-0.5 rounded-full border border-portal-border">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-portal-text group-hover:text-portal-primary transition-colors leading-snug line-clamp-2">
                    {sub.title}
                  </h3>

                  <p className="text-xs text-portal-text-muted mt-2 line-clamp-2 leading-relaxed">
                    {sub.aim}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-portal-border/60 flex items-center justify-between text-xs font-bold text-portal-primary group-hover:text-portal-primary-hover">
                  <span>Open Sub-Experiment</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
