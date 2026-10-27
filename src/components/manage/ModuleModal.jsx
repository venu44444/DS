import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ModuleModal({ isOpen, onClose, moduleToEdit = null }) {
  const { upsertModule, modules } = useData();
  const [form, setForm] = useState({
    id: '',
    number: '',
    title: '',
    description: '',
    topicsText: '',
    objectivesText: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (moduleToEdit) {
      setForm({
        id: moduleToEdit.id || '',
        number: moduleToEdit.number || '',
        title: moduleToEdit.title || '',
        description: moduleToEdit.description || '',
        topicsText: (moduleToEdit.topics || []).join('\n'),
        objectivesText: (moduleToEdit.objectives || []).join('\n')
      });
    } else {
      const nextNum = String(modules.length + 1).padStart(2, '0');
      setForm({
        id: `module-${nextNum}`,
        number: nextNum,
        title: '',
        description: '',
        topicsText: 'Core Topic 1\nCore Topic 2\nCore Topic 3',
        objectivesText: 'Master fundamental skills\nImplement data workflows'
      });
    }
    setError('');
  }, [moduleToEdit, isOpen, modules]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Module title is required.');
      return;
    }
    if (!form.number.trim()) {
      setError('Module number is required.');
      return;
    }

    const payload = {
      id: form.id.trim() || `module-${Date.now()}`,
      number: form.number.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      topics: form.topicsText.split('\n').map(t => t.trim()).filter(Boolean),
      objectives: form.objectivesText.split('\n').map(o => o.trim()).filter(Boolean)
    };

    upsertModule(payload);
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
                <BookOpen className="w-5 h-5 text-portal-primary" />
                <h3 className="text-base font-bold text-portal-text">
                  {moduleToEdit ? `Edit Module ${moduleToEdit.number}` : 'Add New Module'}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    required
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                    placeholder="06"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Unique ID
                  </label>
                  <input
                    type="text"
                    required
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                    placeholder="module-06"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                  placeholder="e.g. Deep Learning and Neural Networks"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text leading-relaxed"
                  placeholder="Comprehensive description of topics and scope..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Topics Covered (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.topicsText}
                  onChange={(e) => setForm({ ...form, topicsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono leading-relaxed"
                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Learning Objectives (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.objectivesText}
                  onChange={(e) => setForm({ ...form, objectivesText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono leading-relaxed"
                  placeholder="Objective 1&#10;Objective 2"
                />
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
                  <span>Save Module</span>
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
