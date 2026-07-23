import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiBell, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../redux/slices/authSlice';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboardPath = {
    super_admin: '/admin/dashboard',
    organizer: '/organizer/dashboard',
    participant: '/participant/dashboard',
  }[user?.role];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-canvas-light/90 backdrop-blur dark:border-paper/10 dark:bg-canvas-dark/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-3xl tracking-wider text-primary-500">
          EVENTRA
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/events" className="text-sm font-medium hover:text-primary-500">Browse Events</Link>
          {isAuthenticated && (
            <Link to={dashboardPath} className="text-sm font-medium hover:text-primary-500">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle dark mode" className="rounded-full p-2 hover:bg-ink/5 dark:hover:bg-paper/10">
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" aria-label="Notifications" className="rounded-full p-2 hover:bg-ink/5 dark:hover:bg-paper/10">
                <FiBell size={18} />
              </Link>
              <button onClick={handleLogout} className="btn-outline hidden sm:inline-flex !py-1.5 !px-4 text-sm">
                Log out
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-outline !py-1.5 !px-4 text-sm">Log in</Link>
              <Link to="/register" className="btn-primary !py-1.5 !px-4 text-sm">Sign up</Link>
            </div>
          )}

          <button className="p-2 md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink/10 px-4 py-3 md:hidden dark:border-paper/10">
          <Link to="/events" className="block py-2 text-sm font-medium">Browse Events</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="block py-2 text-sm font-medium">Dashboard</Link>
              <button onClick={handleLogout} className="block py-2 text-sm font-medium text-left w-full">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-sm font-medium">Log in</Link>
              <Link to="/register" className="block py-2 text-sm font-medium">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
