import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function MaterialModal({ isOpen, onClose, materialToEdit = null }) {
  const { upsertMaterial, modules, materials } = useData();
  const [form, setForm] = useState({
    id: '',
    title: '',
    moduleId: '',
    file: '/pdfs/',
    pages: 10,
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (materialToEdit) {
      setForm({
        id: materialToEdit.id || '',
        title: materialToEdit.title || '',
        moduleId: materialToEdit.moduleId || (modules[0]?.id || 'module-01'),
        file: materialToEdit.file || '/pdfs/',
        pages: materialToEdit.pages || 10,
        description: materialToEdit.description || ''
      });
    } else {
      const nextNum = String(materials.length + 1).padStart(2, '0');
      setForm({
        id: `mat-${nextNum}`,
        title: '',
        moduleId: modules[0]?.id || 'module-01',
        file: `/pdfs/material-manual-${nextNum}.pdf`,
        pages: 12,
        description: ''
      });
    }
    setError('');
  }, [materialToEdit, isOpen, modules, materials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Material title is required.');
      return;
    }
    if (!form.file.trim()) {
      setError('PDF file path is required.');
      return;
    }

    const payload = {
      id: form.id.trim() || `mat-${Date.now()}`,
      title: form.title.trim(),
      moduleId: form.moduleId,
      file: form.file.trim(),
      pages: parseInt(form.pages, 10) || 8,
      description: form.description.trim()
    };

    upsertMaterial(payload);
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
                <FileText className="w-5 h-5 text-portal-primary" />
                <h3 className="text-base font-bold text-portal-text">
                  {materialToEdit ? 'Edit Study Material' : 'Add Study Material'}
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
                    Material ID
                  </label>
                  <input
                    type="text"
                    required
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                    placeholder="mat-01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Target Module
                  </label>
                  <select
                    value={form.moduleId}
                    onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        Module {m.number}: {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                  Material Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text"
                  placeholder="e.g. Statistical Inference Manual"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    PDF Path (in public/pdfs/)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.file}
                    onChange={(e) => setForm({ ...form, file: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                    placeholder="/pdfs/filename.pdf"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={form.pages}
                    onChange={(e) => setForm({ ...form, pages: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text font-mono"
                  />
                </div>
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
                  placeholder="Comprehensive summary of theoretical content..."
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
                  <span>Save Material</span>
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
