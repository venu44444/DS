import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onOpenModal, className = "" }) {
  return (
    <div
      onClick={onOpenModal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal();
        }
      }}
      className={`group relative flex items-center w-full px-4 py-3 bg-portal-card hover:bg-portal-card-hover border border-portal-border hover:border-portal-border-strong rounded-xl shadow-glass-sm cursor-pointer transition-all duration-200 glass-card ${className}`}
      aria-label="Open search dialog"
    >
      <Search className="w-5 h-5 text-portal-text-muted group-hover:text-portal-primary transition-colors shrink-0" />
      <span className="ml-3 text-sm text-portal-text-muted group-hover:text-portal-text transition-colors flex-1 truncate">
        Search experiments, modules, tools, materials...
      </span>
      <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-portal-text-muted bg-portal-bg border border-portal-border rounded-lg shadow-sm">
        <span className="text-[10px]">Ctrl</span> K
      </kbd>
    </div>
  );
}
