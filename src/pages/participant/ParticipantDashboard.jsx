import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClipboard, FiHeart, FiCalendar } from 'react-icons/fi';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService.getMine().then((res) => setTickets(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const upcoming = tickets.filter((t) => new Date(t.event?.startDate) >= new Date());

  return (
    <div>
      <h1 className="mb-6 text-3xl">Welcome back, {user?.name?.split(' ')[0]}</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <FiClipboard className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">{tickets.length}</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Total tickets</div>
        </div>
        <div className="card p-5">
          <FiCalendar className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">{upcoming.length}</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Upcoming events</div>
        </div>
        <div className="card p-5">
          <FiHeart className="mb-2 text-primary-500" size={22} />
          <Link to="/participant/wishlist" className="text-2xl font-semibold hover:underline">View →</Link>
          <div className="text-sm text-ink/60 dark:text-paper/60">Your wishlist</div>
        </div>
      </div>

      <h2 className="mb-4 text-2xl">Upcoming tickets</h2>
      {upcoming.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">No upcoming events. <Link to="/events" className="text-primary-500">Browse events</Link></p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((t) => (
            <div key={t._id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-semibold">{t.event?.title}</div>
                <div className="text-sm text-ink/60 dark:text-paper/60">{formatDate(t.event?.startDate)} · {t.tierName}</div>
              </div>
              <Link to="/participant/tickets" className="btn-outline !py-1.5 !px-4 text-sm">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
