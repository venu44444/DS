import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, FileText, ArrowRight, Edit3, Trash2, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useProgress } from '../context/ProgressContext';
import ModuleModal from '../components/manage/ModuleModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function ModulesPage() {
  const { modules, experiments, removeModule, getExperimentsByModule, getMaterialsByModule } = useData();
  const { getModuleProgress } = useProgress();

  const [moduleToEdit, setModuleToEdit] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const handleEdit = (mod) => {
    setModuleToEdit(mod);
    setIsModuleModalOpen(true);
  };

  const handleCreate = () => {
    setModuleToEdit(null);
    setIsModuleModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (moduleToDelete) {
      removeModule(moduleToDelete.id);
      setModuleToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-portal-border pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-portal-primary/10 border border-portal-primary/20 text-portal-primary text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-portal-text tracking-tight uppercase">
            Data Science Course Modules
          </h1>
          <p className="text-xs sm:text-sm text-portal-text-muted max-w-3xl">
            Five structured curriculum modules progressing from foundational numerical computing through data engineering, statistical inference, visualization, and machine learning.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-all shadow-md shadow-cyan-500/10 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Module</span>
        </button>
      </div>

      {/* Modules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const modExperiments = getExperimentsByModule(mod.id);
          const materials = getMaterialsByModule(mod.id);
          const progress = getModuleProgress(mod.id);

          return (
            <div
              key={mod.id}
              className="group relative rounded-2xl border border-portal-border bg-portal-card p-6 glass-card shadow-glass flex flex-col justify-between hover:border-portal-border-strong transition-all duration-200"
            >
              <div>
                {/* Module Number Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-portal-primary/10 text-portal-primary border border-portal-primary/20 tracking-wider">
                    MODULE {mod.number}
                  </span>
                  <span className="font-mono text-xs font-bold text-portal-primary">
                    {progress.percentage}%
                  </span>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full h-1.5 bg-portal-bg-secondary rounded-full overflow-hidden mb-4 border border-portal-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-portal-text group-hover:text-portal-primary transition-colors leading-snug">
                  {mod.title}
                </h2>

                {/* Description */}
                <p className="text-xs text-portal-text-muted mt-2 leading-relaxed line-clamp-3">
                  {mod.description}
                </p>

                {/* Topics Preview */}
                <div className="mt-4 pt-4 border-t border-portal-border/60 space-y-2">
                  <span className="text-[11px] font-bold text-portal-text-muted uppercase tracking-wider block">
                    Core Topics
                  </span>
                  <ul className="space-y-1.5 text-xs text-portal-text-muted">
                    {(mod.topics || []).slice(0, 3).map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 line-clamp-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-portal-primary shrink-0 mt-1.5" />
                        <span className="truncate">{topic}</span>
                      </li>
                    ))}
                    {(mod.topics || []).length > 3 && (
                      <li className="text-[11px] text-portal-primary font-medium pl-3.5">
                        +{mod.topics.length - 3} more topics...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-portal-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-xs text-portal-text-muted font-mono">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-portal-primary" />
                    {modExperiments.length} Labs
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-portal-teal" />
                    {materials.length} Guides
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/modules/${mod.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-portal-primary hover:text-portal-primary-hover group-hover:translate-x-0.5 transition-all mr-1"
                  >
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(mod)}
                      className="p-1.5 rounded-lg text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary transition-colors"
                      title="Edit module"
                      aria-label={`Edit ${mod.title}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setModuleToDelete(mod)}
                      className="p-1.5 rounded-lg text-portal-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete module"
                      aria-label={`Delete ${mod.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        moduleToEdit={moduleToEdit}
      />

      {/* Delete Module Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(moduleToDelete)}
        onClose={() => setModuleToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Module ${moduleToDelete?.number}?`}
        message={`Are you sure you want to delete "${moduleToDelete?.title}"?`}
        warning={
          experiments.some(e => e.moduleId === moduleToDelete?.id)
            ? 'Warning: One or more experiments are currently assigned to this module. Deleting it will cause them to show as "Unassigned".'
            : null
        }
      />
    </div>
  );
}
