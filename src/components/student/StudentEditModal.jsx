import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, GraduationCap, Building2, UserCheck, Link as LinkIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function StudentEditModal({ isOpen, onClose }) {
  const { student, updateStudent } = useData();

  const [form, setForm] = useState({
    studentId: '',
    name: '',
    rollNumber: '',
    branch: '',
    section: '',
    facultyName: '',
    facultyDesignation: '',
    github: '',
    linkedin: '',
  });

  useEffect(() => {
    if (student) {
      setForm({
        studentId: student.studentId || '',
        name: student.name || '',
        rollNumber: student.rollNumber || '',
        branch: student.branch || '',
        section: student.section || '',
        facultyName: student.faculty?.name || '',
        facultyDesignation: student.faculty?.designation || '',
        github: student.github || '',
        linkedin: student.linkedin || '',
      });
    }
  }, [student, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudent({
      studentId: form.studentId.trim(),
      name: form.name.trim(),
      rollNumber: form.rollNumber.trim(),
      branch: form.branch.trim(),
      section: form.section.trim(),
      faculty: {
        name: form.facultyName.trim(),
        designation: form.facultyDesignation.trim(),
      },
      github: form.github.trim(),
      linkedin: form.linkedin.trim(),
    });
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-portal-card border border-portal-border rounded-2xl shadow-2xl glass-panel z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-portal-border bg-portal-bg-secondary/60">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-portal-primary" />
                <h3 className="text-base font-bold text-portal-text">
                  Edit Student & Academic Profile
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Student Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                    placeholder="e.g. Venu Gopal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                    placeholder="YOUR_STUDENT_ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={form.rollNumber}
                    onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                    placeholder="YOUR_ROLL_NUMBER"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                    placeholder="Data Science"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                    placeholder="DS-2"
                  />
                </div>
              </div>

              {/* Faculty Info */}
              <div className="pt-3 border-t border-portal-border">
                <h4 className="text-xs font-bold text-portal-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Assigned Faculty Mentor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      Faculty Name
                    </label>
                    <input
                      type="text"
                      value={form.facultyName}
                      onChange={(e) => setForm({ ...form, facultyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                      placeholder="YOUR_FACULTY_NAME"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      Faculty Designation
                    </label>
                    <input
                      type="text"
                      value={form.facultyDesignation}
                      onChange={(e) => setForm({ ...form, facultyDesignation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                      placeholder="YOUR_FACULTY_DESIGNATION"
                    />
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="pt-3 border-t border-portal-border">
                <h4 className="text-xs font-bold text-portal-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  Social & Portfolio Links
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-portal-text-muted mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-sm text-portal-text focus:border-portal-primary focus:outline-none"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-portal-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-portal-text-muted hover:text-portal-text hover:bg-portal-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
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
