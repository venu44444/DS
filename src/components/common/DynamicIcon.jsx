import React from 'react';
import * as Icons from 'lucide-react';

const SAFE_ICON_WHITELIST = {
  FileCode: Icons.FileCode,
  Code2: Icons.Code2,
  Cpu: Icons.Cpu,
  Binary: Icons.Binary,
  Table: Icons.Table,
  Sparkles: Icons.Sparkles,
  Activity: Icons.Activity,
  LineChart: Icons.LineChart,
  BarChart3: Icons.BarChart3,
  PieChart: Icons.PieChart,
  Compass: Icons.Compass,
  BrainCircuit: Icons.BrainCircuit,
  Workflow: Icons.Workflow,
  Layers: Icons.Layers,
  Boxes: Icons.Boxes,
  Database: Icons.Database,
  Server: Icons.Server,
  HardDrive: Icons.HardDrive,
  Share2: Icons.Share2,
  GitBranch: Icons.GitBranch,
  FolderGit2: Icons.FolderGit2,
  Terminal: Icons.Terminal,
  Wrench: Icons.Wrench,
  BookOpen: Icons.BookOpen,
  FileText: Icons.FileText,
};

export default function DynamicIcon({ name, className = "w-5 h-5", defaultIcon = "Code2" }) {
  const IconComponent = SAFE_ICON_WHITELIST[name] || SAFE_ICON_WHITELIST[defaultIcon] || Icons.Code2;
  return <IconComponent className={className} />;
}
