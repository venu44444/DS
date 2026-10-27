import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Info, CheckCircle2 } from 'lucide-react';

export default function ArchitectureDiagram({ stages = [] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!Array.isArray(stages) || stages.length === 0) {
    return null;
  }

  const activeStage = stages[selectedIdx] || stages[0];

  return (
    <div className="rounded-2xl border border-portal-border bg-portal-card p-5 sm:p-6 glass-card shadow-glass space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-portal-border/60 pb-3">
        <div>
          <h3 className="text-sm font-bold text-portal-text uppercase tracking-wider">
            Experimental Architecture & Pipeline Flow
          </h3>
          <p className="text-xs text-portal-text-muted mt-0.5">
            Click any architecture stage to inspect its methodological purpose
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-portal-primary font-mono font-medium">
          <span>Stage {selectedIdx + 1} of {stages.length}</span>
        </div>
      </div>

      {/* Responsive Stages Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {stages.map((stage, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIdx(idx)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-portal-primary/20 border-portal-primary text-portal-text shadow-glass-glow'
                  : 'bg-portal-bg-secondary/60 hover:bg-portal-bg-secondary border-portal-border text-portal-text-muted'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono mb-1.5 transition-colors ${
                  isSelected
                    ? 'bg-portal-primary text-slate-950 font-extrabold'
                    : 'bg-portal-card border border-portal-border text-portal-text-muted'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-[11px] font-semibold line-clamp-2 leading-tight">
                {stage.label.replace(/^\d+\.\s*/, '')}
              </span>

              {/* Arrow connector for desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-portal-text-muted/40">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Node Detail Callout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="p-4 rounded-xl bg-portal-bg-secondary/80 border border-portal-primary/30 flex items-start gap-3.5"
        >
          <div className="p-2 rounded-lg bg-portal-primary/10 text-portal-primary shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-portal-text uppercase tracking-wide flex items-center gap-2">
              <span>{activeStage.label}</span>
              <span className="text-[10px] text-portal-primary bg-portal-primary/10 px-2 py-0.5 rounded-full border border-portal-primary/20 font-mono">
                Active Node
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-portal-text-muted mt-1 leading-relaxed">
              {activeStage.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
