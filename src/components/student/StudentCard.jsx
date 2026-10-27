import React, { useState } from 'react';
import { Pencil, GraduationCap, IdCard, GitBranch, Layers, UserCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { GithubIcon, LinkedInIcon } from '../common/BrandIcons';
import StudentEditModal from './StudentEditModal';

export default function StudentCard({ className = "" }) {
  const { student } = useData();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getInitials = (name) => {
    if (!name || name === 'YOUR_NAME') return 'VG';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isPlaceholder = (val) => {
    if (!val) return true;
    return val.startsWith('YOUR_');
  };

  const isGithubSet = student.github && student.github.trim() !== '';
  const isLinkedInSet = student.linkedin && student.linkedin.trim() !== '';

  return (
    <>
      <div className={`relative rounded-2xl border border-portal-border bg-portal-card p-5 sm:p-6 glass-card shadow-glass transition-all ${className}`}>
        {/* Card Header & Avatar */}
        <div className="flex items-start justify-between gap-4 border-b border-portal-border/60 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-lg sm:text-xl tracking-tight select-none">
                {getInitials(student.name)}
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-portal-text tracking-tight flex items-center gap-2">
                {student.name || 'Student Name'}
              </h2>
              <p className="text-xs text-portal-primary font-semibold flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{student.branch || 'Data Science'}</span>
                <span className="text-portal-text-muted/60">•</span>
                <span>Sec {student.section || 'DS-2'}</span>
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="p-2 rounded-xl bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-text-muted hover:text-portal-primary border border-portal-border hover:border-portal-primary/30 transition-all focus:outline-none"
            aria-label="Edit student profile"
            title="Edit student profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="py-4 border-b border-portal-border/60 grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">
              Student ID
            </span>
            <span className={`font-mono text-xs block ${isPlaceholder(student.studentId) ? 'text-portal-text-muted/60 italic' : 'text-portal-text font-bold'}`}>
              {student.studentId || 'YOUR_STUDENT_ID'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider block">
              Roll Number
            </span>
            <span className={`font-mono text-xs block ${isPlaceholder(student.rollNumber) ? 'text-portal-text-muted/60 italic' : 'text-portal-text font-bold'}`}>
              {student.rollNumber || 'YOUR_ROLL_NUMBER'}
            </span>
          </div>
        </div>

        {/* Faculty Mentor Details */}
        <div className="py-4 border-b border-portal-border/60 space-y-1 text-xs">
          <span className="text-[11px] font-semibold text-portal-primary uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Faculty Mentor
          </span>
          <p className={`font-medium ${isPlaceholder(student.faculty?.name) ? 'text-portal-text-muted/60 italic' : 'text-portal-text font-semibold'}`}>
            {student.faculty?.name || 'YOUR_FACULTY_NAME'}
          </p>
          <p className={`text-[11px] ${isPlaceholder(student.faculty?.designation) ? 'text-portal-text-muted/50 italic' : 'text-portal-text-muted'}`}>
            {student.faculty?.designation || 'YOUR_FACULTY_DESIGNATION'}
          </p>
        </div>

        {/* Social Links */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-portal-text-muted uppercase tracking-wider">
            Connected Profiles
          </span>

          <div className="flex items-center gap-2">
            {isGithubSet ? (
              <a
                href={student.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-text-muted hover:text-portal-primary border border-portal-border hover:border-portal-primary/30 text-xs font-medium transition-all"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-portal-bg-secondary/40 text-portal-text-muted/40 border border-portal-border/30 text-xs font-medium cursor-not-allowed group relative"
                title="GitHub URL not set"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub (Not set)</span>
              </div>
            )}

            {isLinkedInSet ? (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-text-muted hover:text-portal-primary border border-portal-border hover:border-portal-primary/30 text-xs font-medium transition-all"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-portal-bg-secondary/40 text-portal-text-muted/40 border border-portal-border/30 text-xs font-medium cursor-not-allowed group relative"
                title="LinkedIn URL not set"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
                <span>LinkedIn (Not set)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Student Modal */}
      <StudentEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
