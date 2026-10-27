import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight, Wrench, Filter, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import DynamicIcon from '../components/common/DynamicIcon';

export default function ToolsPage() {
  const { tools, experiments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    'ALL',
    'Programming',
    'Data Processing',
    'Statistics',
    'Visualization',
    'Machine Learning',
    'Deep Learning',
    'Databases',
    'Big Data and Apps',
    'Development'
  ];

  // Filter tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'ALL' && tool.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = tool.name.toLowerCase().includes(q);
        const inDesc = tool.description.toLowerCase().includes(q);
        const inCat = tool.category.toLowerCase().includes(q);
        const inFeat = (tool.features || []).some(f => f.toLowerCase().includes(q));
        if (!inName && !inDesc && !inCat && !inFeat) return false;
      }
      return true;
    });
  }, [tools, selectedCategory, searchQuery]);

  // Group by category if "ALL" is selected, else show flat list
  const groupedTools = useMemo(() => {
    const groups = {};
    filteredTools.forEach((tool) => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    });
    return groups;
  }, [filteredTools]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-portal-border pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-portal-primary/10 border border-portal-primary/20 text-portal-primary text-xs font-bold uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5" />
          <span>Software Ecosystem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-portal-text tracking-tight uppercase">
          Data Science Tools & Frameworks
        </h1>
        <p className="text-xs sm:text-sm text-portal-text-muted max-w-3xl">
          Curated reference documentation and syntax examples for the 24 foundational tools powering contemporary scientific computation and machine learning pipelines.
        </p>
      </div>

      {/* Toolbar: Search + Category Filter Chips */}
      <div className="p-4 sm:p-5 rounded-2xl border border-portal-border bg-portal-card glass-card space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-portal-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, features, category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-portal-bg border border-portal-border text-xs text-portal-text placeholder:text-portal-text-muted/60 focus:border-portal-primary focus:outline-none"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-portal-border/60">
          <span className="text-[11px] font-bold text-portal-text-muted uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-portal-primary text-slate-950 font-bold shadow-sm'
                  : 'bg-portal-bg hover:bg-portal-bg-secondary text-portal-text-muted hover:text-portal-text border border-portal-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Content Grouped by Category */}
      {filteredTools.length === 0 ? (
        <div className="p-16 border border-portal-border rounded-2xl bg-portal-card text-center space-y-3 glass-card">
          <p className="text-sm font-bold text-portal-text">No tools matched your search query.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="text-xs text-portal-primary hover:underline font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedTools).map(([category, toolsInCat]) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between border-b border-portal-border/60 pb-2">
                <h2 className="text-base font-extrabold text-portal-text tracking-tight uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-portal-primary" />
                  {category} ({toolsInCat.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {toolsInCat.map((tool) => {
                  const usedInExpCount = experiments.filter(
                    e => Array.isArray(e.tools) && e.tools.includes(tool.id)
                  ).length;

                  return (
                    <div
                      key={tool.id}
                      className="rounded-2xl border border-portal-border bg-portal-card p-5 glass-card shadow-glass flex flex-col justify-between hover:border-portal-border-strong transition-all duration-200 group"
                    >
                      <div>
                        {/* Tool Icon & Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-portal-bg-secondary text-portal-primary border border-portal-border group-hover:scale-105 transition-transform">
                              <DynamicIcon name={tool.icon} className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-portal-text group-hover:text-portal-primary transition-colors">
                                {tool.name}
                              </h3>
                              <span className="text-[10px] font-semibold text-portal-primary tracking-wider uppercase">
                                {tool.category}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-portal-text-muted bg-portal-bg px-2 py-0.5 rounded border border-portal-border">
                            {usedInExpCount} Labs
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-portal-text-muted line-clamp-3 leading-relaxed mt-2">
                          {tool.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 pt-3 border-t border-portal-border/60 flex items-center justify-between gap-2">
                        <Link
                          to={`/tools/${tool.id}`}
                          className="flex items-center gap-1.5 text-xs font-bold text-portal-primary hover:text-portal-primary-hover transition-colors"
                        >
                          <span>Documentation</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        {tool.websiteUrl && (
                          <a
                            href={tool.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] font-medium text-portal-text-muted hover:text-portal-text transition-colors"
                            title="Official Website"
                          >
                            <span>Official</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
