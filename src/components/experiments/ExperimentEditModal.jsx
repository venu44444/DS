import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Layers, BookOpen, Binary, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ExperimentEditModal({ isOpen, onClose, experimentToEdit = null }) {
  const { modules, tools, experiments, upsertExperiment } = useData();

  const [activeSection, setActiveSection] = useState('basic'); // 'basic' | 'overview' | 'subs'
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [form, setForm] = useState({
    id: '',
    number: '',
    title: '',
    description: '',
    moduleId: '',
    difficulty: 'Intermediate',
    tools: [],
    tags: '',
    // Overview
    summary: '',
    outcomesText: '',
    architectureText: '',
    // Sub-experiments
    subExperiments: []
  });

  useEffect(() => {
    if (experimentToEdit) {
      setForm({
        id: experimentToEdit.id || `exp-${Date.now()}`,
        number: experimentToEdit.number || '',
        title: experimentToEdit.title || '',
        description: experimentToEdit.description || '',
        moduleId: experimentToEdit.moduleId || (modules[0]?.id || 'module-01'),
        difficulty: experimentToEdit.difficulty || 'Intermediate',
        tools: experimentToEdit.tools || [],
        tags: (experimentToEdit.tags || []).join(', '),
        summary: experimentToEdit.overview?.summary || '',
        outcomesText: (experimentToEdit.overview?.outcomes || []).join('\n'),
        architectureText: (experimentToEdit.overview?.architecture || [])
          .map(a => `${a.label} | ${a.description}`)
          .join('\n'),
        subExperiments: (experimentToEdit.subExperiments || []).map(s => ({
          ...s,
          procedureText: (s.procedure || []).join('\n')
        }))
      });
    } else {
      // New Experiment
      const nextNum = String(experiments.length + 1).padStart(2, '0');
      setForm({
        id: `exp-${nextNum}`,
        number: nextNum,
        title: '',
        description: '',
        moduleId: modules[0]?.id || 'module-01',
        difficulty: 'Beginner',
        tools: ['python'],
        tags: 'Python, Data Science',
        summary: '',
        outcomesText: 'Understand the fundamental programmatic concepts\nImplement algorithmic procedures computationally',
        architectureText: '1. Ingestion | Stream incoming test records\n2. Validation | Inspect datatypes and missingness\n3. Transformation | Apply vectorized arithmetic operations\n4. Aggregation | Compute statistical summary profiles\n5. Visualization | Render output matrices and charts',
        subExperiments: [
          {
            id: 'A',
            title: 'Initial Procedure and Verification',
            aim: 'To verify fundamental execution setup and numerical operations.',
            procedureText: 'Initialize sequence of test data\nApply computational transformation\nPrint verified output table',
            code: 'data = [10, 20, 30]\nprint(f"Total: {sum(data)}")',
            output: 'Total: 60'
          }
        ]
      });
    }
    setActiveSubTab(0);
    setErrorMsg('');
  }, [experimentToEdit, isOpen, modules, experiments]);

  const wordCount = form.description.trim() ? form.description.trim().split(/\s+/).length : 0;

  const toggleTool = (toolId) => {
    setForm(prev => {
      const exists = prev.tools.includes(toolId);
      return {
        ...prev,
        tools: exists ? prev.tools.filter(t => t !== toolId) : [...prev.tools, toolId]
      };
    });
  };

  const handleAddSub = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextLetter = letters[form.subExperiments.length] || `Sub${form.subExperiments.length + 1}`;
    setForm(prev => ({
      ...prev,
      subExperiments: [
        ...prev.subExperiments,
        {
          id: nextLetter,
          title: `Sub-Experiment ${nextLetter}`,
          aim: 'To execute procedure and inspect results.',
          procedureText: 'Step 1: Ingest data\nStep 2: Run transformation\nStep 3: Print summary',
          code: 'print("Running sub-experiment")',
          output: 'Running sub-experiment'
        }
      ]
    }));
    setActiveSubTab(form.subExperiments.length);
  };

  const handleRemoveSub = (index) => {
    if (form.subExperiments.length <= 1) {
      setErrorMsg('An experiment must contain at least 1 sub-experiment.');
      return;
    }
    setForm(prev => ({
      ...prev,
      subExperiments: prev.subExperiments.filter((_, idx) => idx !== index)
    }));
    setActiveSubTab(Math.max(0, index - 1));
  };

  const handleSubChange = (field, val) => {
    setForm(prev => {
      const updated = [...prev.subExperiments];
      updated[activeSubTab] = {
        ...updated[activeSubTab],
        [field]: val
      };
      return { ...prev, subExperiments: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.title.trim()) {
      setErrorMsg('Experiment Title is required.');
      return;
    }
    if (!form.number.trim()) {
      setErrorMsg('Experiment Number is required.');
      return;
    }

    // Number uniqueness check
    const isNumTaken = experiments.some(
      e => e.number === form.number.trim() && e.id !== form.id
    );
    if (isNumTaken) {
      setErrorMsg(`Experiment number ${form.number} is already taken by another experiment.`);
      return;
    }

    // Parse outcomes
    const outcomes = form.outcomesText
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    // Parse architecture
    const architecture = form.architectureText
      .split('\n')
      .map(line => {
        const parts = line.split('|');
        return {
          label: (parts[0] || 'Stage').trim(),
          description: (parts[1] || parts[0] || 'Pipeline processing stage').trim()
        };
      })
      .filter(a => a.label);

    // Parse sub-experiments
    const subExperiments = form.subExperiments.map(s => ({
      id: s.id || 'A',
      title: s.title || 'Sub-experiment',
      aim: s.aim || '',
      procedure: (s.procedureText || '').split('\n').map(p => p.trim()).filter(Boolean),
      code: s.code || '',
      output: s.output || '',
      ...(s.chart ? { chart: s.chart } : {})
    }));

    const experimentPayload = {
      id: form.id,
      number: form.number.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      moduleId: form.moduleId,
      difficulty: form.difficulty,
      tools: form.tools,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      overview: {
        summary: form.summary.trim(),
        outcomes: outcomes.length > 0 ? outcomes : ['Demonstrate computational workflow'],
        architecture: architecture.length > 0 ? architecture : [{ label: '1. Ingestion', description: 'Raw data stream' }]
      },
      subExperiments
    };

    upsertExperiment(experimentPayload);
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-4xl bg-portal-card border border-portal-border rounded-2xl shadow-2xl glass-panel z-10 overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-portal-border bg-portal-bg-secondary/40 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-portal-primary" />
                <h3 className="text-base font-bold text-portal-text">
                  {experimentToEdit ? `Edit Experiment ${experimentToEdit.number}` : 'Create New Experiment'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section Navigation Tabs */}
            <div className="flex border-b border-portal-border px-6 pt-3 gap-2 bg-portal-bg-secondary/20 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSection('basic')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
                  activeSection === 'basic'
                    ? 'bg-portal-card text-portal-primary border-t-2 border-portal-primary'
                    : 'text-portal-text-muted hover:text-portal-text'
                }`}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
                  activeSection === 'overview'
                    ? 'bg-portal-card text-portal-primary border-t-2 border-portal-primary'
                    : 'text-portal-text-muted hover:text-portal-text'
                }`}
              >
                2. Overview & Architecture
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('subs')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors ${
                  activeSection === 'subs'
                    ? 'bg-portal-card text-portal-primary border-t-2 border-portal-primary'
                    : 'text-portal-text-muted hover:text-portal-text'
                }`}
              >
                3. Sub-Experiments ({form.subExperiments.length})
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* SECTION 1: BASIC INFO */}
              {activeSection === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                        Experiment Number (Unique)
                      </label>
                      <input
                        type="text"
                        required
                        value={form.number}
                        onChange={(e) => setForm({ ...form, number: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none font-mono"
                        placeholder="e.g. 16"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                        Experiment Title
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                        placeholder="e.g. Deep Neural Networks with PyTorch"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-portal-text-muted">
                        Description
                      </label>
                      <span className={`text-[11px] font-mono font-bold ${wordCount === 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {wordCount} / 15 words {wordCount === 15 ? '✓ Exact' : ''}
                      </span>
                    </div>
                    <textarea
                      required
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none leading-relaxed"
                      placeholder="Brief overview summary of the experiment (exactly 15 words suggested)..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                        Associated Module
                      </label>
                      <select
                        value={form.moduleId}
                        onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none"
                      >
                        {modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            Module {m.number}: {m.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                        Difficulty Level
                      </label>
                      <select
                        value={form.difficulty}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1.5">
                      Integrated Tools (Click to toggle)
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-portal-bg border border-portal-border">
                      {tools.map((t) => {
                        const isSelected = form.tools.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTool(t.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                              isSelected
                                ? 'bg-portal-primary text-slate-950 font-bold'
                                : 'bg-portal-card hover:bg-portal-bg-secondary text-portal-text-muted border border-portal-border'
                            }`}
                          >
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none font-mono"
                      placeholder="Python, Linear Algebra, Matrix"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 2: OVERVIEW & ARCHITECTURE */}
              {activeSection === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      Academic Overview Summary
                    </label>
                    <textarea
                      rows={3}
                      value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none leading-relaxed"
                      placeholder="Comprehensive overview of scientific principles, theories, and concepts..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      Learning Outcomes (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={form.outcomesText}
                      onChange={(e) => setForm({ ...form, outcomesText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none leading-relaxed font-mono"
                      placeholder="Outcome 1&#10;Outcome 2&#10;Outcome 3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      Architecture Pipeline Stages (Format: Label | Description, one per line)
                    </label>
                    <textarea
                      rows={6}
                      value={form.architectureText}
                      onChange={(e) => setForm({ ...form, architectureText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text focus:border-portal-primary focus:outline-none leading-relaxed font-mono"
                      placeholder="1. Ingestion | Ingest raw test records&#10;2. Validation | Audit data integrity"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 3: SUB-EXPERIMENTS */}
              {activeSection === 'subs' && (
                <div className="space-y-4">
                  {/* Sub-experiment Tabs Header */}
                  <div className="flex items-center justify-between border-b border-portal-border pb-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {form.subExperiments.map((sub, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveSubTab(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                            idx === activeSubTab
                              ? 'bg-portal-primary text-slate-950 shadow-sm'
                              : 'bg-portal-bg-secondary text-portal-text-muted hover:text-portal-text border border-portal-border'
                          }`}
                        >
                          Part {sub.id || idx + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSub}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-primary border border-portal-border transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Part</span>
                    </button>
                  </div>

                  {/* Active Sub-experiment Details */}
                  {form.subExperiments[activeSubTab] && (
                    <div className="space-y-4 bg-portal-bg-secondary/30 p-4 rounded-xl border border-portal-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-portal-primary px-2 py-0.5 rounded bg-portal-primary/10 border border-portal-primary/20">
                            Sub-Experiment {form.subExperiments[activeSubTab].id}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSub(activeSubTab)}
                          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Part</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                            Letter ID
                          </label>
                          <input
                            type="text"
                            value={form.subExperiments[activeSubTab].id || ''}
                            onChange={(e) => handleSubChange('id', e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                            Sub-Experiment Title
                          </label>
                          <input
                            type="text"
                            value={form.subExperiments[activeSubTab].title || ''}
                            onChange={(e) => handleSubChange('title', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                          Aim
                        </label>
                        <input
                          type="text"
                          value={form.subExperiments[activeSubTab].aim || ''}
                          onChange={(e) => handleSubChange('aim', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                          Procedure (One step per line)
                        </label>
                        <textarea
                          rows={3}
                          value={form.subExperiments[activeSubTab].procedureText || ''}
                          onChange={(e) => handleSubChange('procedureText', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono leading-relaxed"
                          placeholder="Step 1...&#10;Step 2..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                          Self-Contained Python Code
                        </label>
                        <textarea
                          rows={5}
                          value={form.subExperiments[activeSubTab].code || ''}
                          onChange={(e) => handleSubChange('code', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-portal-border text-xs text-slate-100 font-mono leading-relaxed selection:bg-cyan-500/20"
                          placeholder="# Python script with inline data"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                          Expected Benchmark Output
                        </label>
                        <textarea
                          rows={4}
                          value={form.subExperiments[activeSubTab].output || ''}
                          onChange={(e) => handleSubChange('output', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-portal-border text-xs text-emerald-400 font-mono leading-relaxed selection:bg-emerald-500/20"
                          placeholder="Expected stdout..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-portal-border flex items-center justify-between gap-3 shrink-0">
                <span className="text-xs text-portal-text-muted italic">
                  Changes save directly to your browser's persistent store.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-portal-text-muted hover:text-portal-text hover:bg-portal-bg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Experiment
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
