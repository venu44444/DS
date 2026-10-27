import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, ArrowUpDown, Layers, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import ExperimentCard from '../components/experiments/ExperimentCard';
import ExperimentEditModal from '../components/experiments/ExperimentEditModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

export default function ExperimentsPage() {
  const { experiments, modules, removeExperiment } = useData();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedTech, setSelectedTech] = useState('ALL');
  const [sortBy, setSortBy] = useState('number-asc'); // 'number-asc' | 'number-desc' | 'title-asc' | 'difficulty'

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [experimentToEdit, setExperimentToEdit] = useState(null);
  const [experimentToDelete, setExperimentToDelete] = useState(null);

  const techFilters = [
    'ALL',
    'Python',
    'NumPy',
    'Pandas',
    'Matplotlib',
    'Statistics',
    'Machine Learning',
    'EDA',
    'Plotly',
    'Scikit-learn'
  ];

  const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };

  // Filter and sort computation
  const filteredExperiments = useMemo(() => {
    return experiments.filter((exp) => {
      // 1. Module filter
      if (selectedModule !== 'ALL' && exp.moduleId !== selectedModule) {
        return false;
      }

      // 2. Difficulty filter
      if (selectedDifficulty !== 'ALL' && exp.difficulty?.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // 3. Technology chip filter
      if (selectedTech !== 'ALL') {
        const matchesTag = (exp.tags || []).some(t => t.toLowerCase().includes(selectedTech.toLowerCase()));
        const matchesTool = (exp.tools || []).some(t => t.toLowerCase().includes(selectedTech.toLowerCase()));
        if (!matchesTag && !matchesTool) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = exp.title.toLowerCase().includes(q);
        const inDesc = exp.description.toLowerCase().includes(q);
        const inNum = String(exp.number).includes(q);
        const inTags = (exp.tags || []).some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inNum && !inTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'number-asc') {
        return parseInt(a.number, 10) - parseInt(b.number, 10);
      }
      if (sortBy === 'number-desc') {
        return parseInt(b.number, 10) - parseInt(a.number, 10);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'difficulty') {
        const diffA = difficultyOrder[a.difficulty?.toLowerCase()] || 2;
        const diffB = difficultyOrder[b.difficulty?.toLowerCase()] || 2;
        return diffA - diffB;
      }
      return 0;
    });
  }, [experiments, selectedModule, selectedDifficulty, selectedTech, searchQuery, sortBy]);

  const handleEdit = (exp) => {
    setExperimentToEdit(exp);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setExperimentToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (experimentToDelete) {
      removeExperiment(experimentToDelete.id);
      setExperimentToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-portal-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-portal-primary/10 border border-portal-primary/20 text-portal-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Experimental Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-portal-text tracking-tight uppercase">
            Data Science Experiments
          </h1>
          <p className="text-xs sm:text-sm text-portal-text-muted mt-1">
            Explore 15 standardized laboratory experiments and 90 rigorous sub-experiment procedures.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-all shadow-md shadow-cyan-500/10 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experiment</span>
        </button>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-portal-border bg-portal-card glass-card space-y-4">
        {/* Row 1: Search & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-portal-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments by title, number, tag..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text placeholder:text-portal-text-muted/60 focus:border-portal-primary focus:outline-none"
            />
          </div>

          {/* Module Select */}
          <div className="sm:col-span-3">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none"
            >
              <option value="ALL">All Modules</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  Module {m.number}: {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="sm:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none font-medium"
            >
              <option value="number-asc">Sort: Number (Asc)</option>
              <option value="number-desc">Sort: Number (Desc)</option>
              <option value="title-asc">Sort: Title (A-Z)</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>
          </div>
        </div>

        {/* Row 2: Technology Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-portal-border/60">
          <span className="text-[11px] font-bold text-portal-text-muted uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Tech:
          </span>
          {techFilters.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSelectedTech(tech)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ${
                selectedTech === tech
                  ? 'bg-portal-primary text-slate-950 font-bold shadow-sm'
                  : 'bg-portal-bg hover:bg-portal-bg-secondary text-portal-text-muted hover:text-portal-text border border-portal-border'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-portal-text-muted px-1">
        <span>
          Showing <span className="text-portal-text font-bold">{filteredExperiments.length}</span> of {experiments.length} experiments
        </span>
        {(selectedModule !== 'ALL' || selectedDifficulty !== 'ALL' || selectedTech !== 'ALL' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedModule('ALL');
              setSelectedDifficulty('ALL');
              setSelectedTech('ALL');
              setSearchQuery('');
            }}
            className="text-portal-primary hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Experiments Grid */}
      {filteredExperiments.length === 0 ? (
        <div className="p-16 border border-portal-border rounded-2xl bg-portal-card text-center space-y-3 glass-card">
          <p className="text-sm font-bold text-portal-text">No experiments matched your search criteria.</p>
          <p className="text-xs text-portal-text-muted">
            Try adjusting your search query, technology filters, or difficulty settings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onEdit={handleEdit}
              onDelete={(exp) => setExperimentToDelete(exp)}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Edit / Create Experiment Modal */}
      <ExperimentEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        experimentToEdit={experimentToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(experimentToDelete)}
        onClose={() => setExperimentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete Experiment ${experimentToDelete?.number}?`}
        message={`Are you sure you want to delete "${experimentToDelete?.title}"? All its ${experimentToDelete?.subExperiments?.length || 0} sub-experiments will be removed from your local database.`}
      />
    </div>
  );
}
