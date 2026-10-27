import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { GithubIcon, LinkedInIcon, MbuLogo } from '../common/BrandIcons';

export default function Footer() {
  const { student } = useData();

  const isGithubSet = student.github && student.github.trim() !== '';
  const isLinkedInSet = student.linkedin && student.linkedin.trim() !== '';

  return (
    <footer className="relative z-10 border-t border-portal-border bg-portal-card/60 backdrop-blur-xl mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Identity & Department */}
          <div className="flex items-center gap-3">
            <MbuLogo className="w-10 h-10 shrink-0" />
            <div>
              <p className="text-sm font-extrabold tracking-wider text-portal-text">
                MOHAN BABU UNIVERSITY
              </p>
              <p className="text-xs text-portal-text-muted">
                Department of Data Science • Learning Portal
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-portal-text-muted">
            <Link to="/" className="hover:text-portal-primary transition-colors">
              Home
            </Link>
            <Link to="/modules" className="hover:text-portal-primary transition-colors">
              Modules
            </Link>
            <Link to="/experiments" className="hover:text-portal-primary transition-colors">
              Experiments
            </Link>
            <Link to="/tools" className="hover:text-portal-primary transition-colors">
              Tools
            </Link>
            <Link to="/manage" className="hover:text-portal-primary transition-colors">
              Manage
            </Link>
          </div>

          {/* Social Links from Student Profile */}
          <div className="flex items-center gap-3">
            {isGithubSet ? (
              <a
                href={student.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-text-muted hover:text-portal-primary border border-portal-border hover:border-portal-primary/30 transition-all"
                aria-label="Student GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            ) : (
              <div
                className="p-2 rounded-xl bg-portal-bg-secondary/40 text-portal-text-muted/40 border border-portal-border/30 cursor-not-allowed group relative"
                title="GitHub link not set in profile"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="sr-only">GitHub (Not set)</span>
              </div>
            )}

            {isLinkedInSet ? (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-portal-bg-secondary hover:bg-portal-primary/10 text-portal-text-muted hover:text-portal-primary border border-portal-border hover:border-portal-primary/30 transition-all"
                aria-label="Student LinkedIn Profile"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
            ) : (
              <div
                className="p-2 rounded-xl bg-portal-bg-secondary/40 text-portal-text-muted/40 border border-portal-border/30 cursor-not-allowed group relative"
                title="LinkedIn link not set in profile"
              >
                <LinkedInIcon className="w-4 h-4" />
                <span className="sr-only">LinkedIn (Not set)</span>
              </div>
            )}
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-8 pt-6 border-t border-portal-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-portal-text-muted gap-2">
          <p>© 2026 Mohan Babu University. All rights reserved.</p>
          <p className="italic text-[11px] text-portal-text-muted/70">
            Designed for interactive data science laboratory experimentation and research.
          </p>
        </div>
      </div>
    </footer>
  );
}
