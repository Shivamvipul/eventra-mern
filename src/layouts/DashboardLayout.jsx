import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { FiGrid, FiCalendar, FiUsers, FiBarChart2, FiSettings, FiCheckSquare, FiFileText, FiHeart, FiUser, FiCamera, FiClipboard, FiMessageSquare, FiCreditCard } from 'react-icons/fi';

const LINKS_BY_ROLE = {
  participant: [
    { to: '/participant/dashboard', label: 'Overview', icon: <FiGrid />, end: true },
    { to: '/participant/bookings', label: 'My Bookings', icon: <FiCreditCard /> },
    { to: '/participant/tickets', label: 'My Tickets', icon: <FiClipboard /> },
    { to: '/participant/wishlist', label: 'Wishlist', icon: <FiHeart /> },
    { to: '/participant/profile', label: 'Profile', icon: <FiUser /> },
  ],
  organizer: [
    { to: '/organizer/dashboard', label: 'Overview', icon: <FiGrid />, end: true },
    { to: '/organizer/events', label: 'Manage Events', icon: <FiCalendar /> },
    { to: '/organizer/events/create', label: 'Create Event', icon: <FiFileText /> },
    { to: '/organizer/attendees', label: 'Attendees', icon: <FiUsers /> },
    { to: '/organizer/scanner', label: 'Scan Attendance', icon: <FiCamera /> },
    { to: '/organizer/feedback', label: 'Feedback', icon: <FiMessageSquare /> },
    { to: '/organizer/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
  ],
  super_admin: [
    { to: '/admin/dashboard', label: 'Overview', icon: <FiGrid />, end: true },
    { to: '/admin/users', label: 'User Management', icon: <FiUsers /> },
    { to: '/admin/organizers', label: 'Organizer Approval', icon: <FiCheckSquare /> },
    { to: '/admin/events', label: 'Event Approval', icon: <FiCalendar /> },
    { to: '/admin/analytics', label: 'System Analytics', icon: <FiBarChart2 /> },
  ],
};

export default function DashboardLayout() {
  useSocket();
  const { role } = useAuth();
  const links = LINKS_BY_ROLE[role] || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar links={links} title={role?.replace('_', ' ')} />
        <div className="flex-1 bg-canvas-light p-4 dark:bg-canvas-dark sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
