import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export function useSearchIndex(query = '') {
  const { experiments, modules, tools, materials } = useData();

  const searchIndex = useMemo(() => {
    const items = [];

    // 1. Experiments
    experiments.forEach(exp => {
      items.push({
        id: `exp-${exp.id}`,
        category: 'EXPERIMENT',
        title: `Experiment ${exp.number}: ${exp.title}`,
        subtitle: exp.description,
        tags: [...(exp.tags || []), ...(exp.tools || []), exp.difficulty || ''],
        url: `/experiments/${exp.id}/overview`,
        rawText: `${exp.number} ${exp.title} ${exp.description} ${(exp.tags || []).join(' ')} ${(exp.tools || []).join(' ')}`
      });

      // 2. Sub-experiments
      if (Array.isArray(exp.subExperiments)) {
        exp.subExperiments.forEach(sub => {
          items.push({
            id: `sub-${exp.id}-${sub.id}`,
            category: 'SUB-EXPERIMENT',
            title: `Experiment ${exp.number}${sub.id}: ${sub.title}`,
            subtitle: sub.aim || sub.title,
            tags: [exp.title, `Experiment ${exp.number}`],
            url: `/experiments/${exp.id}/${sub.id}`,
            rawText: `${exp.number}${sub.id} ${sub.title} ${sub.aim} ${sub.code || ''}`
          });
        });
      }
    });

    // 3. Modules
    modules.forEach(mod => {
      items.push({
        id: `mod-${mod.id}`,
        category: 'MODULE',
        title: `Module ${mod.number}: ${mod.title}`,
        subtitle: mod.description,
        tags: mod.topics || [],
        url: `/modules/${mod.id}`,
        rawText: `${mod.number} ${mod.title} ${mod.description} ${(mod.topics || []).join(' ')}`
      });
    });

    // 4. Tools
    tools.forEach(tool => {
      items.push({
        id: `tool-${tool.id}`,
        category: 'TOOL',
        title: tool.name,
        subtitle: tool.description,
        tags: [tool.category, ...(tool.features || [])],
        url: `/tools/${tool.id}`,
        rawText: `${tool.name} ${tool.category} ${tool.description} ${(tool.features || []).join(' ')}`
      });
    });

    // 5. Materials
    materials.forEach(mat => {
      items.push({
        id: `mat-${mat.id}`,
        category: 'MATERIAL',
        title: mat.title,
        subtitle: mat.description,
        tags: [`Pages: ${mat.pages}`, mat.moduleId],
        url: `/materials/${mat.id}`,
        rawText: `${mat.title} ${mat.description} ${mat.file}`
      });
    });

    return items;
  }, [experiments, modules, tools, materials]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const scored = [];
    const tokens = q.split(/\s+/).filter(Boolean);

    for (const item of searchIndex) {
      let score = 0;
      const lowerTitle = item.title.toLowerCase();
      const lowerSub = item.subtitle ? item.subtitle.toLowerCase() : '';
      const lowerRaw = item.rawText.toLowerCase();

      // Exact title match gets top bonus
      if (lowerTitle.includes(q)) score += 50;
      // Category match
      if (item.category.toLowerCase().includes(q)) score += 30;

      // Token matches
      let matchedTokens = 0;
      for (const t of tokens) {
        if (lowerTitle.includes(t)) {
          score += 20;
          matchedTokens++;
        } else if (lowerSub.includes(t)) {
          score += 10;
          matchedTokens++;
        } else if (item.tags.some(tag => tag.toLowerCase().includes(t))) {
          score += 12;
          matchedTokens++;
        } else if (lowerRaw.includes(t)) {
          score += 5;
          matchedTokens++;
        }
      }

      if (matchedTokens === tokens.length || score > 0) {
        scored.push({ ...item, score });
      }
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [searchIndex, query]);

  return { results, totalIndexed: searchIndex.length };
}
