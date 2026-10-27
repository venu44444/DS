import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, BookOpen, Terminal, Layers, CheckCircle2, ArrowRight, Code2, Sparkles, Copy, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import DynamicIcon from '../components/common/DynamicIcon';
import CodeViewer from '../components/common/CodeViewer';
import ExperimentCard from '../components/experiments/ExperimentCard';

export default function ToolDetailPage() {
  const { toolId } = useParams();
  const { getToolById, getExperimentsByTool } = useData();

  const tool = getToolById(toolId);
  const relatedExperiments = getExperimentsByTool(toolId);

  const [activeSection, setActiveSection] = useState('overview');
  const [copiedInstall, setCopiedInstall] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Key Features' },
    { id: 'installation', label: 'Installation' },
    { id: 'usage', label: 'Basic Usage' },
    { id: 'examples', label: 'Code Examples' },
    { id: 'experiments', label: `Experiments (${relatedExperiments.length})` },
  ];

  const handleCopyInstall = () => {
    if (!tool?.installation) return;
    navigator.clipboard.writeText(tool.installation);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-portal-text">Tool Documentation Not Found</h2>
        <Link to="/tools" className="text-xs font-bold text-portal-primary hover:underline">
          Return to Tools List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-portal-text-muted flex-wrap">
        <Link to="/" className="hover:text-portal-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/tools" className="hover:text-portal-primary transition-colors">
          Tools
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-portal-text">
          {tool.name}
        </span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-3xl border border-portal-border bg-gradient-to-br from-portal-card/90 via-portal-bg-secondary/60 to-portal-card/90 p-6 sm:p-8 glass-card shadow-glass relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-portal-bg-secondary text-portal-primary border border-portal-border shadow-md shrink-0">
              <DynamicIcon name={tool.icon} className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-portal-primary/10 text-portal-primary border border-portal-primary/20 uppercase">
                  {tool.category}
                </span>
                <span className="text-xs text-portal-text-muted font-mono">
                  {relatedExperiments.length} University Labs
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-portal-text tracking-tight">
                {tool.name}
              </h1>
              <p className="text-xs sm:text-sm text-portal-text-muted max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-2.5 shrink-0">
            {tool.docsUrl && (
              <a
                href={tool.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
              >
                <span>Official Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {tool.websiteUrl && (
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card border border-portal-border text-portal-text transition-colors"
              >
                <span>Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Section Jump Menu Bar */}
      <div className="sticky top-20 z-30 flex items-center gap-1.5 overflow-x-auto p-2 rounded-2xl bg-portal-card/90 backdrop-blur-xl border border-portal-border shadow-glass-sm">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeSection === s.id
                ? 'bg-portal-primary text-slate-950 shadow-sm'
                : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10">
        {/* SECTION: OVERVIEW */}
        <section id="overview" className="rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3 scroll-mt-36">
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-portal-primary" />
            Overview & Architectural Role
          </h2>
          <p className="text-xs sm:text-sm text-portal-text-muted leading-relaxed">
            {tool.overview || tool.description}
          </p>
        </section>

        {/* SECTION: FEATURES */}
        {Array.isArray(tool.features) && tool.features.length > 0 && (
          <section id="features" className="rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-4 scroll-mt-36">
            <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-portal-primary" />
              Core Capabilities & Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-portal-bg-secondary/40 border border-portal-border/60">
                  <CheckCircle2 className="w-4 h-4 text-portal-teal shrink-0 mt-0.5" />
                  <span className="text-xs text-portal-text leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: INSTALLATION */}
        {tool.installation && (
          <section id="installation" className="rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3 scroll-mt-36">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-portal-primary" />
                Package Installation
              </h2>
              <button
                type="button"
                onClick={handleCopyInstall}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-portal-text-muted hover:text-portal-text bg-portal-bg border border-portal-border transition-colors"
              >
                {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInstall ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-portal-border overflow-x-auto selection:bg-cyan-500/20">
              {tool.installation}
            </pre>
          </section>
        )}

        {/* SECTION: BASIC USAGE */}
        {tool.usage && (
          <section id="usage" className="rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3 scroll-mt-36">
            <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-portal-primary" />
              Basic Usage Pattern
            </h2>
            <CodeViewer
              code={tool.usage}
              language="python"
              filename={`${tool.id}_usage.py`}
            />
          </section>
        )}

        {/* SECTION: CODE EXAMPLES */}
        {Array.isArray(tool.examples) && tool.examples.length > 0 && (
          <section id="examples" className="space-y-4 scroll-mt-36">
            <h2 className="text-base font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-portal-primary" />
              Demonstration Code Examples
            </h2>
            <div className="space-y-4">
              {tool.examples.map((ex, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-xs font-bold text-portal-text-muted uppercase tracking-wide">
                    Example {idx + 1}: {ex.title}
                  </h3>
                  <CodeViewer
                    code={ex.code}
                    language="python"
                    filename={`${tool.id}_example_${idx + 1}.py`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION: EXPERIMENTS USING THIS TOOL (DERIVED) */}
        <section id="experiments" className="space-y-4 scroll-mt-36">
          <div className="border-b border-portal-border pb-3">
            <h2 className="text-base sm:text-lg font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-portal-primary" />
              Laboratory Experiments Using {tool.name} ({relatedExperiments.length})
            </h2>
            <p className="text-xs text-portal-text-muted mt-0.5">
              Coursework assignments where students interact with this technology
            </p>
          </div>

          {relatedExperiments.length === 0 ? (
            <div className="p-8 border border-portal-border rounded-xl bg-portal-card text-center text-xs text-portal-text-muted italic">
              No experiments currently utilize this tool.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedExperiments.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  experiment={exp}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
