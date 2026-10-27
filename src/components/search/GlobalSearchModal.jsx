import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, CornerDownLeft, FileText, BookOpen, Wrench, Layers } from 'lucide-react';
import { useSearchIndex } from '../../hooks/useSearchIndex';

const CATEGORY_STYLES = {
  EXPERIMENT: {
    bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: Layers,
    label: 'EXPERIMENT'
  },
  'SUB-EXPERIMENT': {
    bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    icon: FileText,
    label: 'SUB-EXPERIMENT'
  },
  MODULE: {
    bg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    icon: BookOpen,
    label: 'MODULE'
  },
  TOOL: {
    bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: Wrench,
    label: 'TOOL'
  },
  MATERIAL: {
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: FileText,
    label: 'MATERIAL'
  }
};

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const { results, totalIndexed } = useSearchIndex(query);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset activeIndex when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) {
        navigate(results[activeIndex].url);
        onClose();
      }
    }
  }, [isOpen, results, activeIndex, navigate, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleSelect = (url) => {
    navigate(url);
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-portal-card border border-portal-border rounded-2xl shadow-2xl overflow-hidden glass-panel z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Global Search"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-portal-border gap-3">
              <Search className="w-5 h-5 text-portal-text-muted shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiments, modules, tools, materials..."
                className="w-full bg-transparent text-portal-text placeholder:text-portal-text-muted/60 text-base focus:outline-none"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results-list"
                aria-activedescendant={results[activeIndex] ? results[activeIndex].id : undefined}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-portal-text-muted bg-portal-bg-secondary border border-portal-border rounded font-mono">
                ESC
              </kbd>
            </div>

            {/* Results Container */}
            <div
              id="search-results-list"
              ref={listRef}
              role="listbox"
              className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-portal-border/30"
            >
              {query.trim() === '' ? (
                <div className="p-8 text-center text-portal-text-muted">
                  <p className="text-sm font-medium">Quick live search across {totalIndexed} indexed resources</p>
                  <p className="text-xs text-portal-text-muted/70 mt-1">
                    Try searching for <span className="text-portal-primary">"pandas"</span>, <span className="text-portal-primary">"regression"</span>, or <span className="text-portal-primary">"module 01"</span>
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-10 text-center text-portal-text-muted">
                  <p className="text-sm font-semibold">No results found for "{query}"</p>
                  <p className="text-xs mt-1 text-portal-text-muted/70">
                    Try searching with another keyword, tool name, or module number.
                  </p>
                </div>
              ) : (
                results.map((item, index) => {
                  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.EXPERIMENT;
                  const Icon = style.icon;
                  const isSelected = index === activeIndex;

                  return (
                    <div
                      key={item.id}
                      id={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(item.url)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-portal-primary/10 border border-portal-primary/30'
                          : 'hover:bg-portal-bg-secondary/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg border shrink-0 ${style.bg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-portal-text text-sm truncate">
                              {item.title}
                            </span>
                            <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${style.bg}`}>
                              {style.label}
                            </span>
                          </div>
                          {item.subtitle && (
                            <p className="text-xs text-portal-text-muted line-clamp-1 mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 self-center text-portal-text-muted">
                        {isSelected && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-portal-primary animate-pulse" />
                        )}
                        <ArrowRight className="w-4 h-4 text-portal-text-muted/50" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-portal-bg-secondary/40 border-t border-portal-border flex items-center justify-between text-[11px] text-portal-text-muted">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-portal-card border border-portal-border rounded">↓</kbd>{' '}
                  <kbd className="px-1.5 py-0.5 bg-portal-card border border-portal-border rounded">↑</kbd> to navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-portal-card border border-portal-border rounded">↵</kbd> to select
                </span>
              </div>
              <span>
                {results.length > 0 ? `${results.length} results` : 'Data Science Portal'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
