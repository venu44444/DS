import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, BookOpen, Wrench, FileText, Database, Plus, Edit3, Trash2, Download, Upload, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import StudentEditModal from '../components/student/StudentEditModal';
import ModuleModal from '../components/manage/ModuleModal';
import ToolModal from '../components/manage/ToolModal';
import MaterialModal from '../components/manage/MaterialModal';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import DynamicIcon from '../components/common/DynamicIcon';

export default function ManagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'student';
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    student,
    modules,
    tools,
    materials,
    experiments,
    removeModule,
    removeTool,
    removeMaterial,
    resetAll,
    exportJSON,
    importJSON
  } = useData();

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const [moduleToEdit, setModuleToEdit] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const [toolToEdit, setToolToEdit] = useState(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);

  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Backup Import state
  const [importStatus, setImportStatus] = useState(null);

  const handleExport = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mbu_ds_portal_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = importJSON(content);
      if (res.success) {
        setImportStatus({ success: true, message: 'Portal database successfully restored from JSON backup!' });
      } else {
        setImportStatus({ success: false, message: res.error || 'Failed to import backup JSON.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [
    { id: 'student', label: 'Student Profile', icon: User },
    { id: 'modules', label: `Modules (${modules.length})`, icon: BookOpen },
    { id: 'tools', label: `Tools (${tools.length})`, icon: Wrench },
    { id: 'materials', label: `Materials (${materials.length})`, icon: FileText },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-portal-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-portal-primary/10 border border-portal-primary/20 text-portal-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Administrative Controls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-portal-text tracking-tight uppercase">
            Portal Content Management
          </h1>
          <p className="text-xs sm:text-sm text-portal-text-muted mt-1">
            Edit, add, remove, and back up all student details, modules, tools, and study materials with zero code changes.
          </p>
        </div>

        {/* Link to Experiments page for experiments editing */}
        <Link
          to="/experiments"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card border border-portal-border hover:border-portal-border-strong text-portal-text transition-all shrink-0 self-start sm:self-auto"
        >
          <span>Manage Experiments</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-portal-border overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-portal-primary text-slate-950 shadow-md font-extrabold'
                  : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STUDENT PROFILE */}
      {activeTab === 'student' && (
        <section className="rounded-2xl border border-portal-border bg-portal-card p-6 glass-card shadow-glass space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-portal-border/60 pb-4">
            <div>
              <h2 className="text-base font-bold text-portal-text uppercase tracking-wide">
                Student Profile Information
              </h2>
              <p className="text-xs text-portal-text-muted mt-0.5">
                Saved locally and immediately reflected on Home, avatar, and footer
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsStudentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Student Credentials</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-portal-bg-secondary/40 border border-portal-border space-y-1">
              <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">Full Name</span>
              <p className="text-sm font-bold text-portal-text">{student.name || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-xl bg-portal-bg-secondary/40 border border-portal-border space-y-1">
              <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">Student ID</span>
              <p className="text-sm font-mono font-bold text-portal-text">{student.studentId || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-xl bg-portal-bg-secondary/40 border border-portal-border space-y-1">
              <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">Roll Number</span>
              <p className="text-sm font-mono font-bold text-portal-text">{student.rollNumber || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-xl bg-portal-bg-secondary/40 border border-portal-border space-y-1">
              <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">Branch / Section</span>
              <p className="text-sm font-bold text-portal-text">{student.branch} • {student.section}</p>
            </div>
            <div className="p-4 rounded-xl bg-portal-bg-secondary/40 border border-portal-border space-y-1">
              <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">Faculty Mentor</span>
              <p className="text-sm font-bold text-portal-text">{student.faculty?.name || 'Not set'}</p>
              <p className="text-[11px] text-portal-text-muted">{student.faculty?.designation || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-xl bg-portal-bg-secondary/40 border border-portal-border space-y-2">
              <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">Social Links</span>
              <div className="space-y-1 text-xs">
                <p className="truncate text-portal-text-muted">
                  <span className="font-semibold text-portal-text">GitHub:</span> {student.github || 'Not set'}
                </p>
                <p className="truncate text-portal-text-muted">
                  <span className="font-semibold text-portal-text">LinkedIn:</span> {student.linkedin || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: MODULES */}
      {activeTab === 'modules' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-portal-border pb-3">
            <div>
              <h2 className="text-base font-bold text-portal-text uppercase tracking-wide">
                Course Modules ({modules.length})
              </h2>
              <p className="text-xs text-portal-text-muted">
                Create new modules or edit existing syllabi and learning objectives
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModuleToEdit(null);
                setIsModuleModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="divide-y divide-portal-border border border-portal-border rounded-2xl bg-portal-card overflow-hidden">
            {modules.map((m) => {
              const assignedExpCount = experiments.filter(e => e.moduleId === m.id).length;
              return (
                <div key={m.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-portal-bg-secondary/40 transition-colors">
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-portal-primary/10 text-portal-primary">
                        M{m.number} ({m.id})
                      </span>
                      <h3 className="text-sm font-bold text-portal-text">
                        {m.title}
                      </h3>
                      <span className="text-[10px] text-portal-text-muted bg-portal-bg px-2 py-0.5 rounded border border-portal-border">
                        {assignedExpCount} Labs
                      </span>
                    </div>
                    <p className="text-xs text-portal-text-muted line-clamp-2">
                      {m.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setModuleToEdit(m);
                        setIsModuleModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary border border-portal-border transition-colors"
                      title="Edit Module"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setModuleToDelete(m)}
                      className="p-2 rounded-xl text-portal-text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-portal-border hover:border-rose-500/30 transition-colors"
                      title="Delete Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: TOOLS */}
      {activeTab === 'tools' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-portal-border pb-3">
            <div>
              <h2 className="text-base font-bold text-portal-text uppercase tracking-wide">
                Tools & Technologies ({tools.length})
              </h2>
              <p className="text-xs text-portal-text-muted">
                Add frameworks, update installation commands, or link new documentation
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setToolToEdit(null);
                setIsToolModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Tool</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => {
              const expUsage = experiments.filter(e => Array.isArray(e.tools) && e.tools.includes(t.id)).length;
              return (
                <div key={t.id} className="p-4 rounded-xl border border-portal-border bg-portal-card glass-card flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-portal-bg-secondary text-portal-primary">
                        <DynamicIcon name={t.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-portal-text">{t.name}</h3>
                        <span className="text-[10px] text-portal-text-muted uppercase font-mono">{t.category}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-portal-text-muted bg-portal-bg px-1.5 py-0.5 rounded border border-portal-border">
                      {expUsage} Labs
                    </span>
                  </div>

                  <p className="text-xs text-portal-text-muted line-clamp-2">
                    {t.description}
                  </p>

                  <div className="pt-2 border-t border-portal-border/60 flex items-center justify-between">
                    <Link to={`/tools/${t.id}`} className="text-xs font-semibold text-portal-primary hover:underline">
                      View Docs
                    </Link>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setToolToEdit(t);
                          setIsToolModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setToolToDelete(t)}
                        className="p-1.5 rounded-lg text-portal-text-muted hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 4: MATERIALS */}
      {activeTab === 'materials' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-portal-border pb-3">
            <div>
              <h2 className="text-base font-bold text-portal-text uppercase tracking-wide">
                Study Materials & Manuals ({materials.length})
              </h2>
              <p className="text-xs text-portal-text-muted">
                Configure PDF manual paths, page numbers, and descriptions
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMaterialToEdit(null);
                setIsMaterialModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Material</span>
            </button>
          </div>

          <div className="divide-y divide-portal-border border border-portal-border rounded-2xl bg-portal-card overflow-hidden">
            {materials.map((mat) => (
              <div key={mat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-portal-bg-secondary/40 transition-colors">
                <div className="space-y-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-portal-primary/10 text-portal-primary">
                      {mat.id}
                    </span>
                    <h3 className="text-sm font-bold text-portal-text">
                      {mat.title}
                    </h3>
                    <span className="text-[10px] text-portal-text-muted bg-portal-bg px-2 py-0.5 rounded border border-portal-border">
                      {mat.pages} Pages
                    </span>
                    <span className="text-[10px] font-mono text-portal-text-muted">
                      {mat.file}
                    </span>
                  </div>
                  <p className="text-xs text-portal-text-muted line-clamp-1">
                    {mat.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    to={`/materials/${mat.id}`}
                    className="p-2 rounded-xl text-portal-text-muted hover:text-portal-primary hover:bg-portal-bg-secondary border border-portal-border transition-colors"
                    title="View PDF"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMaterialToEdit(mat);
                      setIsMaterialModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary border border-portal-border transition-colors"
                    title="Edit Material"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialToDelete(mat)}
                    className="p-2 rounded-xl text-portal-text-muted hover:text-rose-400 hover:bg-rose-500/10 border border-portal-border hover:border-rose-500/30 transition-colors"
                    title="Delete Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <section className="space-y-6">
          <div className="border-b border-portal-border pb-3">
            <h2 className="text-base font-bold text-portal-text uppercase tracking-wide">
              Database Backup & Recovery
            </h2>
            <p className="text-xs text-portal-text-muted mt-0.5">
              Export your portal database as a portable JSON snapshot or restore from a validated file
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                importStatus.success
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
              }`}
            >
              {importStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Export JSON Card */}
            <div className="p-6 rounded-2xl border border-portal-border bg-portal-card glass-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit mb-3">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-portal-text">Export Portal JSON</h3>
                <p className="text-xs text-portal-text-muted mt-1 leading-relaxed">
                  Download a full snapshot of your current experiments, modules, tools, and student profile as a standalone JSON file.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export Snapshot</span>
              </button>
            </div>

            {/* Import JSON Card */}
            <div className="p-6 rounded-2xl border border-portal-border bg-portal-card glass-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-portal-text">Import Portal JSON</h3>
                <p className="text-xs text-portal-text-muted mt-1 leading-relaxed">
                  Upload a previously exported JSON backup. Schema validation verifies required data structures before applying changes.
                </p>
              </div>
              <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card border border-portal-border text-portal-text cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset to Factory Defaults Card */}
            <div className="p-6 rounded-2xl border border-rose-500/20 bg-portal-card glass-card space-y-4 flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit mb-3">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-portal-text">Reset to Defaults</h3>
                <p className="text-xs text-portal-text-muted mt-1 leading-relaxed">
                  Revert all experiments, modules, tools, and student credentials back to the original source code data templates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODALS */}
      <StudentEditModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />

      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        moduleToEdit={moduleToEdit}
      />

      <ToolModal
        isOpen={isToolModalOpen}
        onClose={() => setIsToolModalOpen(false)}
        toolToEdit={toolToEdit}
      />

      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        materialToEdit={materialToEdit}
      />

      {/* Delete Module Confirm */}
      <ConfirmDeleteModal
        isOpen={Boolean(moduleToDelete)}
        onClose={() => setModuleToDelete(null)}
        onConfirm={() => {
          if (moduleToDelete) removeModule(moduleToDelete.id);
        }}
        title={`Delete Module ${moduleToDelete?.number}?`}
        message={`Are you sure you want to delete "${moduleToDelete?.title}"?`}
        warning={
          experiments.some(e => e.moduleId === moduleToDelete?.id)
            ? 'Warning: One or more experiments are currently assigned to this module. Deleting it will cause them to show as "Unassigned".'
            : null
        }
      />

      {/* Delete Tool Confirm */}
      <ConfirmDeleteModal
        isOpen={Boolean(toolToDelete)}
        onClose={() => setToolToDelete(null)}
        onConfirm={() => {
          if (toolToDelete) removeTool(toolToDelete.id);
        }}
        title={`Delete Tool: ${toolToDelete?.name}?`}
        message={`Are you sure you want to delete "${toolToDelete?.name}"?`}
        warning={
          experiments.some(e => Array.isArray(e.tools) && e.tools.includes(toolToDelete?.id))
            ? 'Warning: One or more experiments currently list this tool in their requirements.'
            : null
        }
      />

      {/* Delete Material Confirm */}
      <ConfirmDeleteModal
        isOpen={Boolean(materialToDelete)}
        onClose={() => setMaterialToDelete(null)}
        onConfirm={() => {
          if (materialToDelete) removeMaterial(materialToDelete.id);
        }}
        title="Delete Study Material?"
        message={`Are you sure you want to delete "${materialToDelete?.title}"?`}
      />

      {/* Reset Confirmation */}
      <ConfirmDeleteModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetAll();
          setIsResetConfirmOpen(false);
          setImportStatus({ success: true, message: 'All portal data has been reset to defaults!' });
        }}
        title="Reset All Data to Defaults?"
        message="This will wipe all custom experiments, edited modules, tools, and student modifications in your local browser storage and restore the original template data."
        warning="All unsaved or un-exported customizations will be permanently replaced."
      />
    </div>
  );
}
