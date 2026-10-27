import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useData } from './DataContext';

const PROGRESS_KEY = 'mbu_ds_progress_v1';
const RECENT_KEY = 'mbu_ds_recent_v1';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { experiments, modules } = useData();

  // Completed sub-experiments keyed by `${expId}:${subId}`
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return {};
  });

  // Recent experiment IDs array
  const [recentExpIds, setRecentExpIds] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load recent experiments from localStorage', e);
    }
    return [];
  });

  // Persist completed progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
    } catch (e) {
      console.warn('Failed to persist progress to localStorage', e);
    }
  }, [completed]);

  // Persist recent experiments
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentExpIds));
    } catch (e) {
      console.warn('Failed to persist recent experiments to localStorage', e);
    }
  }, [recentExpIds]);

  const toggleSubExperiment = useCallback((expId, subId) => {
    const key = `${expId}:${subId}`;
    setCompleted(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = new Date().toISOString();
      }
      return next;
    });
  }, []);

  const isSubExperimentCompleted = useCallback((expId, subId) => {
    const key = `${expId}:${subId}`;
    return Boolean(completed[key]);
  }, [completed]);

  const recordRecentExperiment = useCallback((expId) => {
    if (!expId) return;
    setRecentExpIds(prev => {
      const filtered = prev.filter(id => id !== expId);
      return [expId, ...filtered].slice(0, 5); // Keep top 5 recent
    });
  }, []);

  // Compute Experiment Progress
  const getExperimentProgress = useCallback((expId) => {
    const exp = experiments.find(e => e.id === expId);
    if (!exp || !Array.isArray(exp.subExperiments) || exp.subExperiments.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    const total = exp.subExperiments.length;
    let comp = 0;
    exp.subExperiments.forEach(sub => {
      if (completed[`${expId}:${sub.id}`]) comp++;
    });
    return {
      completed: comp,
      total,
      percentage: Math.round((comp / total) * 100),
    };
  }, [experiments, completed]);

  // Compute Module Progress
  const getModuleProgress = useCallback((moduleId) => {
    const modExperiments = experiments.filter(e => e.moduleId === moduleId);
    let totalSub = 0;
    let completedSub = 0;

    modExperiments.forEach(exp => {
      if (Array.isArray(exp.subExperiments)) {
        totalSub += exp.subExperiments.length;
        exp.subExperiments.forEach(sub => {
          if (completed[`${exp.id}:${sub.id}`]) completedSub++;
        });
      }
    });

    return {
      completed: completedSub,
      total: totalSub,
      percentage: totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0,
      experimentCount: modExperiments.length
    };
  }, [experiments, completed]);

  // Compute Overall Portal Progress
  const getOverallProgress = useCallback(() => {
    let totalSub = 0;
    let completedSub = 0;

    experiments.forEach(exp => {
      if (Array.isArray(exp.subExperiments)) {
        totalSub += exp.subExperiments.length;
        exp.subExperiments.forEach(sub => {
          if (completed[`${exp.id}:${sub.id}`]) completedSub++;
        });
      }
    });

    return {
      completed: completedSub,
      total: totalSub,
      percentage: totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0,
      totalExperiments: experiments.length,
      totalModules: modules.length,
    };
  }, [experiments, modules, completed]);

  const resetProgress = useCallback(() => {
    setCompleted({});
    setRecentExpIds([]);
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {
      console.warn('Failed to clear progress storage', e);
    }
  }, []);

  const value = {
    completed,
    recentExpIds,
    toggleSubExperiment,
    isSubExperimentCompleted,
    recordRecentExperiment,
    getExperimentProgress,
    getModuleProgress,
    getOverallProgress,
    resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
