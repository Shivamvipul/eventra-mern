import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-canvas-light dark:border-paper/10 dark:bg-canvas-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl tracking-wider text-primary-500">EVENTRA</span>
            <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">Find your next room full of your people.</p>
            <div className="mt-4 flex gap-3 text-ink/60 dark:text-paper/60">
              <FiTwitter /> <FiInstagram /> <FiLinkedin />
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2 text-sm text-ink/70 dark:text-paper/70">
              <li><Link to="/events">All Events</Link></li>
              <li><Link to="/events?category=technical">Technical</Link></li>
              <li><Link to="/events?category=workshop">Workshops</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Organize</h4>
            <ul className="space-y-2 text-sm text-ink/70 dark:text-paper/70">
              <li><Link to="/register">Become an Organizer</Link></li>
              <li><Link to="/organizer/dashboard">Organizer Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm text-ink/70 dark:text-paper/70">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="ticket-perforation mt-10 pt-6 text-center text-xs text-ink/50 dark:text-paper/50">
          © {new Date().getFullYear()} Eventra. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
