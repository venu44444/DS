import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Scene3D = lazy(() => import('./Scene3D'));

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('3D Background Canvas Error caught gracefully:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default function Background3D() {
  const [shouldRender, setShouldRender] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasWebGL = checkWebGLSupport();

    if (!isMobile && !prefersReducedMotion && hasWebGL) {
      setShouldRender(true);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShouldRender(false);
      } else if (!prefersReducedMotion && hasWebGL) {
        setShouldRender(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Gradient Lights */}
      {isDark ? (
        <>
          <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-cyan-500/[0.08] rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-1/4 -right-40 w-[36rem] h-[36rem] bg-indigo-500/[0.09] rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-40 left-1/4 w-[38rem] h-[38rem] bg-purple-600/[0.07] rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-2/3 right-1/4 w-[28rem] h-[28rem] bg-teal-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-indigo-100/50 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-40 left-1/3 w-[34rem] h-[34rem] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* 2. Micro Coordinate Grid Pattern (Academic Data Science Blueprint) */}
      <div
        className="absolute inset-0 opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)`
            : `radial-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.2) 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.2) 85%)',
        }}
      />

      {/* 3. Three.js Canvas Scene */}
      {shouldRender && (
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </CanvasErrorBoundary>
      )}
    </div>
  );
}
