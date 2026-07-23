import React from 'react';
import { NavLink } from 'react-router-dom';

// links: [{ to, label, icon: <Icon /> }]
export default function Sidebar({ links, title }) {
  return (
    <aside className="w-full shrink-0 border-r border-ink/10 bg-surface-light p-4 dark:border-paper/10 dark:bg-surface-dark md:w-60">
      <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-paper/50">{title}</h2>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-primary-500 text-white' : 'text-ink/70 hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
