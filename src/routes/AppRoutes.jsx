import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import LandingPage from '../pages/landing/LandingPage';
import EventList from '../pages/events/EventList';
import EventDetail from '../pages/events/EventDetail';
import Notifications from '../pages/Notifications';
import NotFound from '../pages/NotFound';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import MyTickets from '../pages/participant/MyTickets';
import Bookings from '../pages/participant/Bookings';
import Checkout from '../pages/participant/Checkout';
import Wishlist from '../pages/participant/Wishlist';
import Profile from '../pages/participant/Profile';

import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import CreateEvent from '../pages/organizer/CreateEvent';
import ManageEvents from '../pages/organizer/ManageEvents';
import Attendees from '../pages/organizer/Attendees';
import Scanner from '../pages/organizer/Scanner';
import Analytics from '../pages/organizer/Analytics';
import Feedback from '../pages/organizer/Feedback';

import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import OrganizerApproval from '../pages/admin/OrganizerApproval';
import EventApproval from '../pages/admin/EventApproval';
import SystemAnalytics from '../pages/admin/SystemAnalytics';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Participant dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute roles={['participant']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
        <Route path="/participant/bookings" element={<Bookings />} />
        <Route path="/participant/tickets" element={<MyTickets />} />
        <Route path="/participant/wishlist" element={<Wishlist />} />
        <Route path="/participant/profile" element={<Profile />} />
      </Route>

      {/* Standalone checkout flow (no sidebar) */}
      <Route path="/checkout/:bookingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

      {/* Organizer dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute roles={['organizer', 'super_admin']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<ManageEvents />} />
        <Route path="/organizer/events/create" element={<CreateEvent />} />
        <Route path="/organizer/attendees" element={<Attendees />} />
        <Route path="/organizer/scanner" element={<Scanner />} />
        <Route path="/organizer/feedback" element={<Feedback />} />
        <Route path="/organizer/analytics" element={<Analytics />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute roles={['super_admin']}>
              <DashboardLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/organizers" element={<OrganizerApproval />} />
        <Route path="/admin/events" element={<EventApproval />} />
        <Route path="/admin/analytics" element={<SystemAnalytics />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
