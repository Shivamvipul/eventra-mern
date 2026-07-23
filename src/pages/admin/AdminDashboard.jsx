import React, { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiCheckSquare } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    adminService.getAnalytics().then((res) => setAnalytics(res.data.data));
  }, []);

  if (!analytics) return <Loader />;

  const cards = [
    { label: 'Total Users', value: analytics.totalUsers, icon: <FiUsers /> },
    { label: 'Organizers', value: analytics.totalOrganizers, icon: <FiUsers /> },
    { label: 'Published Events', value: `${analytics.publishedEvents}/${analytics.totalEvents}`, icon: <FiCalendar /> },
    { label: 'Total Bookings', value: analytics.totalBookings, icon: <FiCheckSquare /> },
    { label: 'Total Revenue', value: formatCurrency(analytics.totalRevenue), icon: <FiDollarSign /> },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl">System Overview</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="mb-2 text-primary-500">{c.icon}</div>
            <div className="text-2xl font-semibold">{c.value}</div>
            <div className="text-sm text-ink/60 dark:text-paper/60">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
