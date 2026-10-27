import React, { useEffect, useState } from 'react';
import { Layers, BookOpen, Binary, Wrench } from 'lucide-react';
import { useData } from '../../context/DataContext';

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 1200; // ms
    const target = Number(value) || 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.floor(ease * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function StatisticsGrid() {
  const { experiments, modules, tools } = useData();

  // Computed from data, never hard-coded!
  const totalExperiments = experiments.length;
  const totalModules = modules.length;
  const totalSubExperiments = experiments.reduce((acc, exp) => {
    return acc + (Array.isArray(exp.subExperiments) ? exp.subExperiments.length : 0);
  }, 0);
  const totalTools = tools.length;

  const stats = [
    {
      id: 'experiments',
      label: 'Total Experiments',
      value: totalExperiments,
      icon: Layers,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20',
    },
    {
      id: 'modules',
      label: 'Data Science Modules',
      value: totalModules,
      icon: BookOpen,
      color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'sub-experiments',
      label: 'Sub Experiments',
      value: totalSubExperiments,
      icon: Binary,
      color: 'from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/20',
    },
    {
      id: 'tools',
      label: 'Ecosystem Tools',
      value: totalTools,
      icon: Wrench,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="p-4 sm:p-5 rounded-2xl border border-portal-border bg-portal-card glass-card relative overflow-hidden group hover:border-portal-border-strong transition-all duration-200"
          >
            <div className={`p-2.5 rounded-xl border w-fit mb-3 bg-gradient-to-br ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-portal-text tracking-tight font-mono">
              <AnimatedNumber value={stat.value} />
            </div>
            <p className="text-xs font-semibold text-portal-text-muted mt-1 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
