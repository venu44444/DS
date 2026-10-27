import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Layers, FileText, CheckCircle2, ArrowRight, Wrench, Sparkles, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useProgress } from '../context/ProgressContext';
import ExperimentCard from '../components/experiments/ExperimentCard';
import DynamicIcon from '../components/common/DynamicIcon';
import ModuleModal from '../components/manage/ModuleModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function ModuleDetailPage() {
  const { moduleId } = useParams();
  const { getModuleById, getExperimentsByModule, getMaterialsByModule, tools, experiments: allExperiments, removeModule } = useData();
  const { getModuleProgress } = useProgress();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const moduleData = getModuleById(moduleId);
  const experiments = getExperimentsByModule(moduleId);
  const materials = getMaterialsByModule(moduleId);
  const progress = getModuleProgress(moduleId);

  // Derive unique tools used across this module's experiments
  const derivedToolIds = Array.from(
    new Set(experiments.flatMap(e => (Array.isArray(e.tools) ? e.tools : [])))
  );
  const derivedTools = derivedToolIds.map(id => {
    return tools.find(t => t.id === id) || { id, name: id, category: 'General', icon: 'Code2' };
  });

  const handleDeleteConfirm = () => {
    removeModule(moduleData.id);
    navigate('/modules');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-portal-text-muted flex-wrap">
        <Link to="/" className="hover:text-portal-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/modules" className="hover:text-portal-primary transition-colors">
          Modules
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-portal-text truncate">
          Module {moduleData.number}: {moduleData.title}
        </span>
      </nav>

      {/* Module Overview Hero Banner */}
      <div className="rounded-3xl border border-portal-border bg-gradient-to-br from-portal-card/90 via-portal-bg-secondary/60 to-portal-card/90 p-6 sm:p-8 glass-card shadow-glass relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs font-black px-3.5 py-1 rounded-xl bg-portal-primary/10 text-portal-primary border border-portal-primary/20 tracking-wider">
            MODULE {moduleData.number}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-portal-primary flex items-center gap-1.5 mr-2">
              <CheckCircle2 className="w-4 h-4 text-portal-primary" />
              <span>Progress: {progress.percentage}% ({progress.completed}/{progress.total} Completed)</span>
            </span>

            {/* Edit and Delete Buttons */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 rounded-lg text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary border border-portal-border transition-colors"
              title="Edit module"
              aria-label={`Edit ${moduleData.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 rounded-lg text-portal-text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-portal-border hover:border-rose-500/30 transition-colors"
              title="Delete module"
              aria-label={`Delete ${moduleData.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-portal-text tracking-tight uppercase leading-tight">
          {moduleData.title}
        </h1>

        <p className="text-xs sm:text-sm text-portal-text-muted max-w-3xl leading-relaxed">
          {moduleData.description}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-portal-bg-secondary rounded-full overflow-hidden border border-portal-border/60">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Objectives and Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Learning Objectives */}
        <div className="lg:col-span-6 rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3">
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-portal-primary" />
            Learning Objectives
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-portal-text-muted">
            {(moduleData.objectives || []).map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-portal-teal shrink-0 mt-0.5" />
                <span className="leading-snug">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Syllabus Topics */}
        <div className="lg:col-span-6 rounded-2xl border border-portal-border bg-portal-card p-6 glass-card space-y-3">
          <h2 className="text-sm font-bold text-portal-text uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-portal-teal" />
            Core Topics & Curricular Coverage
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-portal-text-muted">
            {(moduleData.topics || []).map((topic, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-portal-primary shrink-0 mt-1.5" />
                <span className="leading-snug">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Module Experiments Section */}
      <section className="space-y-4">
        <div className="border-b border-portal-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-portal-text uppercase tracking-wider">
              Module Experiments ({experiments.length})
            </h2>
            <p className="text-xs text-portal-text-muted mt-0.5">
              Laboratory assignments mapped to this curriculum module
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              showActions={false}
            />
          ))}
        </div>
      </section>

      {/* Study Materials & Laboratory Guides */}
      <section className="space-y-4">
        <div className="border-b border-portal-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-portal-text uppercase tracking-wider">
              Study Materials & PDF Manuals ({materials.length})
            </h2>
            <p className="text-xs text-portal-text-muted mt-0.5">
              Official university course guides, cheatsheets, and theoretical manuals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="rounded-2xl border border-portal-border bg-portal-card p-5 glass-card shadow-glass flex flex-col justify-between hover:border-portal-border-strong transition-all"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-portal-text line-clamp-2 leading-snug">
                  {mat.title}
                </h3>
                <p className="text-xs text-portal-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>
                <div className="mt-3 text-[11px] font-mono text-portal-text-muted flex items-center justify-between">
                  <span>{mat.pages} Pages</span>
                  <span className="text-portal-teal">PDF Guide</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-portal-border/60">
                <Link
                  to={`/materials/${mat.id}`}
                  className="flex items-center justify-between text-xs font-bold text-portal-primary hover:text-portal-primary-hover transition-colors"
                >
                  <span>Open PDF Viewer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Associated Software Tools (Derived) */}
      <section className="space-y-4">
        <div className="border-b border-portal-border pb-3">
          <h2 className="text-base sm:text-lg font-bold text-portal-text uppercase tracking-wider">
            Derived Technologies & Tools ({derivedTools.length})
          </h2>
          <p className="text-xs text-portal-text-muted mt-0.5">
            Software frameworks utilized across experiments within this module
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {derivedTools.map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-portal-card hover:bg-portal-card-hover border border-portal-border hover:border-portal-primary/40 glass-card transition-all group"
            >
              <div className="p-2 rounded-lg bg-portal-bg-secondary text-portal-primary group-hover:scale-110 transition-transform">
                <DynamicIcon name={tool.icon} className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-portal-text group-hover:text-portal-primary transition-colors block truncate">
                  {tool.name}
                </span>
                <span className="text-[10px] text-portal-text-muted block truncate">
                  {tool.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Edit Module Modal */}
      <ModuleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        moduleToEdit={moduleData}
      />

      {/* Delete Module Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Module ${moduleData?.number}?`}
        message={`Are you sure you want to delete "${moduleData?.title}"?`}
        warning={
          allExperiments.some(e => e.moduleId === moduleData?.id)
            ? 'Warning: One or more experiments are currently assigned to this module. Deleting it will cause them to show as "Unassigned".'
            : null
        }
      />
    </div>
  );
}
