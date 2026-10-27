import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle2, Circle, Target, ListOrdered, FileCode, Play, Terminal } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useProgress } from '../context/ProgressContext';
import CodeViewer from '../components/common/CodeViewer';
import OutputViewer from '../components/experiments/OutputViewer';
import Sandbox from '../components/experiments/Sandbox';

export default function SubExperimentPage() {
  const { experimentId, subExperimentId } = useParams();
  const { getExperimentById, getModuleById } = useData();
  const { isSubExperimentCompleted, toggleSubExperiment, recordRecentExperiment } = useProgress();
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
        <h2 className="text-xl font-bold text-portal-text">Experiment Not Found</h2>
        <Link to="/experiments" className="text-xs font-bold text-portal-primary hover:underline">
          Return to Experiments
        </Link>
      </div>
    );
  }

  const subExperiments = experiment.subExperiments || [];
  const currentSubIndex = subExperiments.findIndex(
    s => s.id?.toLowerCase() === subExperimentId?.toLowerCase()
  );
  const currentSub = subExperiments[currentSubIndex] || subExperiments[0];

  if (!currentSub) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-portal-text">Sub-Experiment Not Found</h2>
        <Link to={`/experiments/${experiment.id}/overview`} className="text-xs font-bold text-portal-primary hover:underline">
          Return to Experiment Overview
        </Link>
      </div>
    );
  }

  const isCompleted = isSubExperimentCompleted(experiment.id, currentSub.id);
  const prevSub = currentSubIndex > 0 ? subExperiments[currentSubIndex - 1] : null;
  const nextSub = currentSubIndex < subExperiments.length - 1 ? subExperiments[currentSubIndex + 1] : null;
  const mod = getModuleById(experiment.moduleId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-portal-text-muted flex-wrap">
        <Link to="/" className="hover:text-portal-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/experiments" className="hover:text-portal-primary transition-colors">
          Experiments
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/experiments/${experiment.id}/overview`} className="hover:text-portal-primary transition-colors">
          Experiment {experiment.number}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-portal-text truncate max-w-[220px]">
          Part {currentSub.id}: {currentSub.title}
        </span>
      </nav>

      {/* Sub-Experiment Header & A-F Switcher Bar */}
      <div className="rounded-2xl border border-portal-border bg-portal-card p-5 sm:p-6 glass-card shadow-glass space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-portal-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-portal-primary/10 text-portal-primary border border-portal-primary/20">
                EXP {experiment.number} • PART {currentSub.id}
              </span>
              <span className="text-xs text-portal-text-muted">
                {experiment.title}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-portal-text tracking-tight">
              {currentSub.title}
            </h1>
          </div>

          {/* Mark as Completed Toggle Button */}
          <button
            type="button"
            onClick={() => toggleSubExperiment(experiment.id, currentSub.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-emerald-500/10'
                : 'bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-text border border-portal-border hover:border-portal-primary/30'
            }`}
            aria-pressed={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Marked as Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-portal-text-muted" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        </div>

        {/* A-F Switcher with Previous / Next Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Previous Sub-experiment Button */}
          {prevSub ? (
            <button
              type="button"
              onClick={() => navigate(`/experiments/${experiment.id}/${prevSub.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary border border-portal-border transition-colors w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev: Part {prevSub.id}</span>
            </button>
          ) : (
            <div className="hidden sm:block w-24" />
          )}

          {/* A-F Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full justify-center">
            {subExperiments.map((sub) => {
              const isActive = sub.id === currentSub.id;
              const completed = isSubExperimentCompleted(experiment.id, sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => navigate(`/experiments/${experiment.id}/${sub.id}`)}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-portal-primary text-slate-950 shadow-md font-extrabold'
                      : 'bg-portal-bg-secondary text-portal-text-muted hover:text-portal-text border border-portal-border hover:border-portal-border-strong'
                  }`}
                  title={`${sub.title} ${completed ? '(Completed)' : ''}`}
                >
                  <span>{sub.id}</span>
                  {completed && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Sub-experiment Button */}
          {nextSub ? (
            <button
              type="button"
              onClick={() => navigate(`/experiments/${experiment.id}/${nextSub.id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary border border-portal-border transition-colors w-full sm:w-auto justify-center"
            >
              <span>Next: Part {nextSub.id}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              to={`/experiments/${experiment.id}/overview`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-portal-primary hover:bg-portal-bg-secondary border border-portal-border transition-colors w-full sm:w-auto justify-center"
            >
              <span>Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* AIM & PROCEDURE SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Aim Card */}
        <div className="lg:col-span-5 rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3">
          <h2 className="text-xs font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-portal-primary" />
            Aim of the Experiment
          </h2>
          <p className="text-xs sm:text-sm text-portal-text-muted leading-relaxed font-medium">
            {currentSub.aim}
          </p>
        </div>

        {/* Procedure Card */}
        <div className="lg:col-span-7 rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3">
          <h2 className="text-xs font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-portal-teal" />
            Step-by-Step Procedure
          </h2>
          <ol className="space-y-2 text-xs sm:text-sm text-portal-text-muted">
            {(currentSub.procedure || []).map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-portal-bg-secondary border border-portal-border flex items-center justify-center text-[10px] font-mono font-bold text-portal-primary shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* BENCHMARK CODE & EXPECTED OUTPUT */}
      <section className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-portal-primary" />
            Standard Benchmark Source Code
          </h2>
          <CodeViewer
            code={currentSub.code}
            language="python"
            filename={`exp_${experiment.number}_part_${currentSub.id.toLowerCase()}.py`}
          />
        </div>

        <div>
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-portal-teal" />
            Verified Standard Output
          </h2>
          <OutputViewer
            output={currentSub.output}
            chart={currentSub.chart}
          />
        </div>
      </section>

      {/* INTERACTIVE EXPERIMENTATION SANDBOX */}
      <section className="pt-6 border-t border-portal-border">
        <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider mb-3 flex items-center gap-2">
          <Play className="w-4 h-4 text-portal-primary" />
          Interactive Execution Sandbox
        </h2>
        <Sandbox
          initialCode={currentSub.code}
          expectedOutput={currentSub.output}
          chart={currentSub.chart}
        />
      </section>
    </div>
  );
}
