import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy-loaded pages as specified
const HomePage = lazy(() => import('./pages/HomePage'));
const ModulesPage = lazy(() => import('./pages/ModulesPage'));
const ModuleDetailPage = lazy(() => import('./pages/ModuleDetailPage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));
const ExperimentOverviewPage = lazy(() => import('./pages/ExperimentOverviewPage'));
const SubExperimentPage = lazy(() => import('./pages/SubExperimentPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage'));
const MaterialViewerPage = lazy(() => import('./pages/MaterialViewerPage'));
const ManagePage = lazy(() => import('./pages/ManagePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Redirect helper component
function ExperimentRedirect() {
  const { experimentId } = useParams();
  return <Navigate to={`/experiments/${experimentId}/overview`} replace />;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading Data Science Portal..." />}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Home */}
          <Route index element={<HomePage />} />

          {/* Modules */}
          <Route path="modules" element={<ModulesPage />} />
          <Route path="modules/:moduleId" element={<ModuleDetailPage />} />

          {/* Experiments (Order matters as strictly specified) */}
          <Route path="experiments" element={<ExperimentsPage />} />
          <Route path="experiments/:experimentId/overview" element={<ExperimentOverviewPage />} />
          <Route path="experiments/:experimentId" element={<ExperimentRedirect />} />
          <Route path="experiments/:experimentId/:subExperimentId" element={<SubExperimentPage />} />

          {/* Tools */}
          <Route path="tools" element={<ToolsPage />} />
          <Route path="tools/:toolId" element={<ToolDetailPage />} />

          {/* Materials / PDF Viewer */}
          <Route path="materials/:materialId" element={<MaterialViewerPage />} />

          {/* Manage Everything */}
          <Route path="manage" element={<ManagePage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
