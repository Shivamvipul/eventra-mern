import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiDollarSign, FiPlusCircle } from 'react-icons/fi';
import { eventService } from '../../services/eventService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getMine().then((res) => setEvents(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const totalSeatsSold = events.reduce((sum, e) => sum + (e.capacity - e.availableSeats), 0);
  const published = events.filter((e) => e.status === 'published');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl">Organizer Overview</h1>
        <Link to="/organizer/events/create" className="btn-primary"><FiPlusCircle /> New Event</Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <FiCalendar className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">{events.length}</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Total events ({published.length} live)</div>
        </div>
        <div className="card p-5">
          <FiUsers className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">{totalSeatsSold}</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Seats sold across all events</div>
        </div>
        <div className="card p-5">
          <FiDollarSign className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">
            {formatCurrency(events.reduce((sum, e) => sum + e.ticketTiers.reduce((s, t) => s + t.price * t.sold, 0), 0))}
          </div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Estimated revenue</div>
        </div>
      </div>

      <h2 className="mb-4 text-2xl">Your events</h2>
      <div className="space-y-3">
        {events.slice(0, 6).map((e) => (
          <div key={e._id} className="card flex items-center justify-between p-4">
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-ink/60 dark:text-paper/60">{formatDate(e.startDate)} · {e.capacity - e.availableSeats}/{e.capacity} booked</div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              e.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
              e.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
              e.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-ink/10'
            }`}>
              {e.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
