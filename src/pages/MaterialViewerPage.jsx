import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Download, ExternalLink, Maximize, Minimize, ZoomIn, ZoomOut, RotateCcw, AlertCircle, FileText, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function MaterialViewerPage() {
  const { materialId } = useParams();
  const { getMaterialById, getModuleById } = useData();

  const material = getMaterialById(materialId);
  const mod = material ? getModuleById(material.moduleId) : null;

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const totalPages = material?.pages || 8;

  // Verify file existence via HEAD fetch
  const verifyFile = async () => {
    if (!material?.file) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch(material.file, { method: 'HEAD' });
      if (res.ok || res.status === 200 || res.status === 304) {
        setIsLoading(false);
      } else {
        // Retry with GET range or fallback
        const getRes = await fetch(material.file, { headers: { Range: 'bytes=0-10' } });
        if (getRes.ok) {
          setIsLoading(false);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      }
    } catch (e) {
      // Local development or static asset handling
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyFile();
    setCurrentPage(1);
    setZoomPercent(100);
  }, [materialId]);

  // Page navigation (clamped to page count)
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Zoom controls (clamped 50% - 200%)
  const handleZoomIn = () => {
    setZoomPercent(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomPercent(prev => Math.max(50, prev - 25));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!material) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-portal-text">Study Material Not Found</h2>
        <Link to="/modules" className="text-xs font-bold text-portal-primary hover:underline">
          Return to Modules
        </Link>
      </div>
    );
  }

  // Construct iframe src with PDF parameters
  const iframeSrc = `${material.file}#page=${currentPage}&zoom=${zoomPercent}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-portal-text-muted flex-wrap">
        <Link to="/" className="hover:text-portal-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/modules" className="hover:text-portal-primary transition-colors">
          Modules
        </Link>
        {mod && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/modules/${mod.id}`} className="hover:text-portal-primary transition-colors truncate max-w-[200px]">
              Module {mod.number}: {mod.title}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-portal-text truncate max-w-[240px]">
          {material.title}
        </span>
      </nav>

      {/* Material Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-portal-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-portal-primary px-2.5 py-0.5 rounded bg-portal-primary/10 border border-portal-primary/20">
              PDF MANUAL
            </span>
            <span className="text-xs text-portal-text-muted">
              {totalPages} Pages total
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-portal-text tracking-tight">
            {material.title}
          </h1>
          <p className="text-xs text-portal-text-muted mt-1 max-w-3xl">
            {material.description}
          </p>
        </div>

        {/* External / Download Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={material.file}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-portal-bg-secondary hover:bg-portal-card border border-portal-border hover:border-portal-border-strong text-portal-text transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>

          <a
            href={material.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-portal-primary hover:bg-portal-primary-hover text-slate-950 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>

      {/* Interactive PDF Viewer Container */}
      <div
        ref={containerRef}
        className={`rounded-2xl border border-portal-border bg-slate-950 overflow-hidden shadow-2xl flex flex-col ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[750px]'
        }`}
      >
        {/* PDF Viewer Control Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-900/90 backdrop-blur-md gap-3 select-none">
          {/* Page Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Previous Page"
              aria-label="Previous Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-slate-300 px-2">
              Page <span className="font-bold text-cyan-400">{currentPage}</span> of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Next Page"
              aria-label="Next Page"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomPercent <= 50}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Zoom Out (Min 50%)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs text-slate-300 px-2 min-w-[50px] text-center font-semibold">
              {zoomPercent}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomPercent >= 200}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title="Zoom In (Max 200%)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen & Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                setZoomPercent(100);
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Viewer Viewport Body */}
        <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <Loader2 className="w-8 h-8 text-portal-primary animate-spin" />
              <p className="text-xs text-slate-300 font-medium">Verifying and loading PDF file...</p>
            </div>
          )}

          {hasError && !isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center max-w-md">
              <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Unable to load material. Try again.</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Could not read "{material.file}". Ensure the placeholder PDF exists in <code className="text-cyan-400">public/pdfs/</code>.
              </p>
              <button
                type="button"
                onClick={verifyFile}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-portal-primary text-slate-950 hover:bg-portal-primary-hover transition-colors shadow-sm"
              >
                Retry Loading
              </button>
            </div>
          )}

          {!hasError && !isLoading && (
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              title={material.title}
              className="w-full h-full border-none bg-white"
              style={{
                transformOrigin: 'top center',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
