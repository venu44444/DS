import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Layers, Sparkles, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';
import StudentCard from '../components/student/StudentCard';
import StatisticsGrid from '../components/home/StatisticsGrid';
import LearningProgressCard from '../components/home/LearningProgressCard';
import ExperimentCard from '../components/experiments/ExperimentCard';
import SearchBar from '../components/search/SearchBar';
import GlobalSearchModal from '../components/search/GlobalSearchModal';

export default function HomePage() {
  const { experiments, modules } = useData();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('ALL');

  const filteredExperiments = selectedModuleFilter === 'ALL'
    ? experiments
    : experiments.filter(e => e.moduleId === selectedModuleFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl border border-portal-border bg-gradient-to-br from-portal-card/90 via-portal-bg-secondary/70 to-portal-card/90 p-6 sm:p-10 glass-card shadow-glass overflow-hidden">
        {/* Glow acccents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-portal-primary/10 border border-portal-primary/20 text-portal-primary text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mohan Babu University</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-portal-text tracking-tight uppercase leading-none">
            DATA SCIENCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              LEARNING PORTAL
            </span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-portal-primary tracking-wide">
            Learn • Experiment • Analyze • Build
          </p>

          <p className="text-xs sm:text-sm text-portal-text-muted leading-relaxed max-w-2xl">
            A comprehensive, interactive curriculum covering scientific Python, data preprocessing, exploratory statistical analysis, multivariate modeling, and production machine learning pipelines.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/experiments"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-all shadow-md shadow-cyan-500/10"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Experiments</span>
            </Link>

            <Link
              to="/modules"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card text-portal-text border border-portal-border hover:border-portal-border-strong transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Modules</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Layout (Desktop: sticky left student card, mobile ordered) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar: Student Profile Card & Progress on Desktop */}
        <div className="order-2 lg:order-1 lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <StudentCard />
          <div className="hidden lg:block">
            <LearningProgressCard />
          </div>
        </div>

        {/* Right Main Content Stream */}
        <div className="order-1 lg:order-2 lg:col-span-8 space-y-8">
          {/* Global Search Bar */}
          <SearchBar onOpenModal={() => setIsSearchOpen(true)} />

          {/* Animated Statistics Grid */}
          <StatisticsGrid />

          {/* Mobile Only: Progress Card shows between statistics and experiments */}
          <div className="block lg:hidden">
            <LearningProgressCard />
          </div>

          {/* Experiments Section */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-portal-border pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-portal-text tracking-tight">
                  Core Experiments
                </h2>
                <p className="text-xs text-portal-text-muted mt-0.5">
                  Interactive laboratory assignments with self-contained Python source code
                </p>
              </div>

              {/* Module Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <button
                  type="button"
                  onClick={() => setSelectedModuleFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    selectedModuleFilter === 'ALL'
                      ? 'bg-portal-primary text-slate-950 font-bold'
                      : 'bg-portal-bg-secondary text-portal-text-muted hover:text-portal-text border border-portal-border'
                  }`}
                >
                  All
                </button>
                {modules.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModuleFilter(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedModuleFilter === m.id
                        ? 'bg-portal-primary text-slate-950 font-bold'
                        : 'bg-portal-bg-secondary text-portal-text-muted hover:text-portal-text border border-portal-border'
                    }`}
                  >
                    M{m.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Experiment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExperiments.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  experiment={exp}
                  showActions={false}
                />
              ))}
            </div>

            <div className="pt-4 text-center">
              <Link
                to="/experiments"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card border border-portal-border text-portal-text hover:text-portal-primary transition-colors"
              >
                <span>View All Filterable Experiments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
