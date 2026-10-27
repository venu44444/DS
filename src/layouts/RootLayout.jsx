import React, { useState, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Background3D from '../components/background/Background3D';
import GlobalSearchModal from '../components/search/GlobalSearchModal';
import ScrollToTop from '../components/common/ScrollToTop';

export default function RootLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const currentOutlet = useOutlet();

  // Listen for global Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-portal-bg text-portal-text antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
      <ScrollToTop />

      {/* 3D Particle and Network Background (Lazy, pointer-events none, mobile guarded) */}
      <Background3D />

      {/* Sticky Glass Header */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Page Content with Framer Motion Page Transitions */}
      <main className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
