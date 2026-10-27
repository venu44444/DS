import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Settings, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { MbuLogo } from '../common/BrandIcons';

export default function Header({ onOpenSearch }) {
  const { isDark, toggleTheme } = useTheme();
  const { student } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name || name === 'YOUR_NAME') return 'VG';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/modules', label: 'MODULES' },
    { to: '/experiments', label: 'EXPERIMENTS' },
    { to: '/tools', label: 'TOOLS' },
  ];

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-portal-border bg-portal-card/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand & Monogram Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-portal-primary rounded-xl"
        >
          <MbuLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-portal-text uppercase">
              MOHAN BABU UNIVERSITY
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-portal-primary tracking-tight">
              DATA SCIENCE LEARNING PORTAL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-portal-primary bg-portal-primary/10 shadow-sm border border-portal-primary/30'
                    : 'text-portal-text-muted hover:text-portal-text hover:bg-portal-bg-secondary/60'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-portal-bg-secondary hover:bg-portal-bg-secondary/80 border border-portal-border text-portal-text-muted hover:text-portal-text transition-all text-xs font-medium focus:outline-none"
            aria-label="Search portal (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-portal-primary" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-portal-card border border-portal-border rounded text-portal-text-muted">
              Ctrl+K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-portal-bg-secondary hover:bg-portal-bg-secondary/80 border border-portal-border text-portal-text-muted hover:text-portal-text transition-colors focus:outline-none"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Manage Button */}
          <Link
            to="/manage"
            className="p-2 rounded-xl bg-portal-bg-secondary hover:bg-portal-bg-secondary/80 border border-portal-border text-portal-text-muted hover:text-portal-text transition-colors focus:outline-none"
            aria-label="Manage portal settings"
            title="Manage Portal Data"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Student Avatar */}
          <div
            onClick={() => navigate('/manage?tab=student')}
            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
            title={`${student.name || 'Student'} (${student.rollNumber || 'Roll No'})`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/manage?tab=student');
            }}
          >
            {getInitials(student.name)}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-portal-bg-secondary border border-portal-border text-portal-text focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-portal-border px-4 pt-3 pb-5 bg-portal-card/95 backdrop-blur-2xl space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleMobileNavClick}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-colors ${
                  isActive
                    ? 'text-portal-primary bg-portal-primary/10 border border-portal-primary/30'
                    : 'text-portal-text hover:bg-portal-bg-secondary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-portal-border/50">
            <Link
              to="/manage"
              onClick={handleMobileNavClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-portal-text hover:bg-portal-bg-secondary"
            >
              <Settings className="w-4 h-4" />
              MANAGE PORTAL
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
