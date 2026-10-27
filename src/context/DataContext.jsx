import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultStudent } from '../data/student.js';
import { defaultModules } from '../data/modules.js';
import { defaultExperiments } from '../data/experiments.js';
import { defaultTools } from '../data/tools.js';
import { defaultMaterials } from '../data/materials.js';

const STORAGE_KEY = 'mbu_ds_portal_v1';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.version === 1 && parsed.experiments && parsed.modules) {
          return {
            student: parsed.student || defaultStudent,
            modules: parsed.modules || defaultModules,
            experiments: parsed.experiments || defaultExperiments,
            tools: parsed.tools || defaultTools,
            materials: parsed.materials || defaultMaterials,
          };
        }
      }
    } catch (e) {
      console.error('Failed to parse portal data from localStorage', e);
    }
    return {
      student: defaultStudent,
      modules: defaultModules,
      experiments: defaultExperiments,
      tools: defaultTools,
      materials: defaultMaterials,
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        ...data,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save portal data to localStorage', e);
    }
  }, [data]);

  // Student Update
  const updateStudent = useCallback((updatedStudent) => {
    setData(prev => ({
      ...prev,
      student: { ...prev.student, ...updatedStudent }
    }));
  }, []);

  // Module Upsert / Remove
  const upsertModule = useCallback((mod) => {
    setData(prev => {
      const exists = prev.modules.some(m => m.id === mod.id);
      return {
        ...prev,
        modules: exists
          ? prev.modules.map(m => (m.id === mod.id ? mod : m))
          : [...prev.modules, mod]
      };
    });
  }, []);

  const removeModule = useCallback((moduleId) => {
    setData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }));
  }, []);

  // Experiment Upsert / Remove
  const upsertExperiment = useCallback((exp) => {
    setData(prev => {
      const exists = prev.experiments.some(e => e.id === exp.id);
      return {
        ...prev,
        experiments: exists
          ? prev.experiments.map(e => (e.id === exp.id ? exp : e))
          : [...prev.experiments, exp]
      };
    });
  }, []);

  const removeExperiment = useCallback((expId) => {
    setData(prev => ({
      ...prev,
      experiments: prev.experiments.filter(e => e.id !== expId)
    }));
  }, []);

  // Tool Upsert / Remove
  const upsertTool = useCallback((tool) => {
    setData(prev => {
      const exists = prev.tools.some(t => t.id === tool.id);
      return {
        ...prev,
        tools: exists
          ? prev.tools.map(t => (t.id === tool.id ? tool : t))
          : [...prev.tools, tool]
      };
    });
  }, []);

  const removeTool = useCallback((toolId) => {
    setData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== toolId)
    }));
  }, []);

  // Material Upsert / Remove
  const upsertMaterial = useCallback((mat) => {
    setData(prev => {
      const exists = prev.materials.some(m => m.id === mat.id);
      return {
        ...prev,
        materials: exists
          ? prev.materials.map(m => (m.id === mat.id ? mat : m))
          : [...prev.materials, mat]
      };
    });
  }, []);

  const removeMaterial = useCallback((matId) => {
    setData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== matId)
    }));
  }, []);

  // Reset all to defaults
  const resetAll = useCallback(() => {
    const defaultState = {
      student: defaultStudent,
      modules: defaultModules,
      experiments: defaultExperiments,
      tools: defaultTools,
      materials: defaultMaterials,
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage', e);
    }
    setData(defaultState);
  }, []);

  // Export JSON backup
  const exportJSON = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      student: data.student,
      modules: data.modules,
      experiments: data.experiments,
      tools: data.tools,
      materials: data.materials,
    };
    return JSON.stringify(payload, null, 2);
  }, [data]);

  // Import JSON backup with schema validation
  const importJSON = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Uploaded file is not a valid JSON object.' };
      }
      if (!Array.isArray(parsed.modules) || !Array.isArray(parsed.experiments)) {
        return { success: false, error: 'JSON is missing required "modules" or "experiments" arrays.' };
      }
      if (!parsed.student || typeof parsed.student !== 'object') {
        return { success: false, error: 'JSON is missing valid "student" data object.' };
      }

      setData({
        student: parsed.student,
        modules: parsed.modules,
        experiments: parsed.experiments,
        tools: Array.isArray(parsed.tools) ? parsed.tools : defaultTools,
        materials: Array.isArray(parsed.materials) ? parsed.materials : defaultMaterials,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: `JSON Parse error: ${err.message}` };
    }
  }, []);

  // Lookup helpers with graceful fallback for missing references
  const getModuleById = useCallback((id) => {
    return data.modules.find(m => m.id === id) || {
      id: id || 'unassigned',
      number: '??',
      title: 'Unassigned Module',
      description: 'The associated module has been removed or is unassigned.',
      topics: [],
      objectives: []
    };
  }, [data.modules]);

  const getExperimentById = useCallback((id) => {
    return data.experiments.find(e => e.id === id) || null;
  }, [data.experiments]);

  const getToolById = useCallback((id) => {
    return data.tools.find(t => t.id === id) || null;
  }, [data.tools]);

  const getMaterialById = useCallback((id) => {
    return data.materials.find(m => m.id === id) || null;
  }, [data.materials]);

  const getExperimentsByModule = useCallback((moduleId) => {
    return data.experiments.filter(e => e.moduleId === moduleId);
  }, [data.experiments]);

  const getMaterialsByModule = useCallback((moduleId) => {
    return data.materials.filter(m => m.moduleId === moduleId);
  }, [data.materials]);

  const getExperimentsByTool = useCallback((toolId) => {
    return data.experiments.filter(e => Array.isArray(e.tools) && e.tools.includes(toolId));
  }, [data.experiments]);

  const getToolsForExperiment = useCallback((exp) => {
    if (!exp || !Array.isArray(exp.tools)) return [];
    return exp.tools.map(toolId => {
      const tool = data.tools.find(t => t.id === toolId);
      return tool || { id: toolId, name: toolId, category: 'General', icon: 'Code2' };
    });
  }, [data.tools]);

  const value = {
    student: data.student,
    modules: data.modules,
    experiments: data.experiments,
    tools: data.tools,
    materials: data.materials,
    updateStudent,
    upsertModule,
    removeModule,
    upsertExperiment,
    removeExperiment,
    upsertTool,
    removeTool,
    upsertMaterial,
    removeMaterial,
    resetAll,
    exportJSON,
    importJSON,
    getModuleById,
    getExperimentById,
    getToolById,
    getMaterialById,
    getExperimentsByModule,
    getMaterialsByModule,
    getExperimentsByTool,
    getToolsForExperiment,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
