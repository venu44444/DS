import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center space-y-6">
      <div className="relative">
        <span className="text-8xl sm:text-9xl font-black text-portal-primary/10 tracking-tighter select-none font-mono">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 rounded-3xl bg-portal-primary/10 text-portal-primary border border-portal-primary/30 shadow-glass-glow animate-pulse">
            <Compass className="w-12 h-12" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-portal-text uppercase tracking-tight">
          404 / Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-portal-text-muted leading-relaxed">
          The requested curriculum resource, experiment, or tool documentation could not be located on the portal.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-all shadow-md shadow-cyan-500/10"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/experiments"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card border border-portal-border text-portal-text transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Experiments</span>
        </Link>
      </div>
    </div>
  );
}
