import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Wrench } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ICON_OPTIONS = [
  'FileCode', 'Code2', 'Cpu', 'Binary', 'Table', 'Sparkles', 'Activity',
  'LineChart', 'BarChart3', 'PieChart', 'Compass', 'BrainCircuit',
  'Workflow', 'Layers', 'Boxes', 'Database', 'Server', 'HardDrive',
  'Share2', 'GitBranch', 'FolderGit2', 'Terminal'
];

const CATEGORY_OPTIONS = [
  'Programming',
  'Data Processing',
  'Statistics',
  'Visualization',
  'Machine Learning',
  'Deep Learning',
  'Databases',
  'Big Data and Apps',
  'Development'
];

export default function ToolModal({ isOpen, onClose, toolToEdit = null }) {
  const { upsertTool } = useData();
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: 'Data Processing',
    icon: 'Table',
    description: '',
    overview: '',
    featuresText: '',
    installation: '',
    usage: '',
    docsUrl: '',
    websiteUrl: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (toolToEdit) {
      setForm({
        id: toolToEdit.id || '',
        name: toolToEdit.name || '',
        category: toolToEdit.category || 'Programming',
        icon: toolToEdit.icon || 'Code2',
        description: toolToEdit.description || '',
        overview: toolToEdit.overview || '',
        featuresText: (toolToEdit.features || []).join('\n'),
        installation: toolToEdit.installation || '',
        usage: toolToEdit.usage || '',
        docsUrl: toolToEdit.docsUrl || '',
        websiteUrl: toolToEdit.websiteUrl || ''
      });
    } else {
      setForm({
        id: '',
        name: '',
        category: 'Programming',
        icon: 'Code2',
        description: '',
        overview: '',
        featuresText: 'High performance numerical operations\nComprehensive API support',
        installation: 'pip install library-name',
        usage: 'import library as lib\nprint("Initialized")',
        docsUrl: '',
        websiteUrl: ''
      });
    }
    setError('');
  }, [toolToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Tool name is required.');
      return;
    }

    const toolId = form.id.trim() || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const payload = {
      id: toolId,
      name: form.name.trim(),
      category: form.category,
      icon: form.icon,
      description: form.description.trim(),
      overview: form.overview.trim() || form.description.trim(),
      features: form.featuresText.split('\n').map(f => f.trim()).filter(Boolean),
      installation: form.installation.trim(),
      usage: form.usage.trim(),
      examples: toolToEdit?.examples || [
        {
          title: `Basic ${form.name} Example`,
          code: form.usage.trim() || `# Example usage for ${form.name}`
        }
      ],
      docsUrl: form.docsUrl.trim(),
      websiteUrl: form.websiteUrl.trim()
    };

    upsertTool(payload);
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-portal-card border border-portal-border rounded-2xl shadow-2xl glass-panel z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-portal-border bg-portal-bg-secondary/40">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-portal-primary" />
                <h3 className="text-base font-bold text-portal-text">
                  {toolToEdit ? `Edit Tool: ${toolToEdit.name}` : 'Add New Tool'}
                </h3>
              </div>
              <button type="button" onClick={onClose} className="p-1 rounded-lg text-portal-text-muted hover:text-portal-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Tool Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm(prev => ({
                        ...prev,
                        name,
                        id: prev.id || name.toLowerCase().replace(/[^a-z0-9]/g, '-')
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                    placeholder="e.g. Polars"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Unique Tool ID
                  </label>
                  <input
                    type="text"
                    required
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                    placeholder="polars"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Icon
                  </label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico} value={ico}>{ico}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text leading-relaxed"
                  placeholder="Concise overview of what this tool accomplishes..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={2}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                  placeholder="Feature 1&#10;Feature 2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Installation Command
                </label>
                <input
                  type="text"
                  value={form.installation}
                  onChange={(e) => setForm({ ...form, installation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-portal-border text-xs text-cyan-300 font-mono"
                  placeholder="pip install library"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Basic Usage Code
                </label>
                <textarea
                  rows={3}
                  value={form.usage}
                  onChange={(e) => setForm({ ...form, usage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-portal-border text-xs text-slate-100 font-mono"
                  placeholder="import library as lib&#10;lib.process()"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Documentation URL
                  </label>
                  <input
                    type="url"
                    value={form.docsUrl}
                    onChange={(e) => setForm({ ...form, docsUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                    placeholder="https://docs.example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-portal-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-portal-text-muted hover:text-portal-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tool</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
