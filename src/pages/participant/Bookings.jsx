import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCreditCard, FiXCircle } from 'react-icons/fi';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import { formatDate, formatCurrency } from '../../utils/helpers';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-ink/10 text-ink/60',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const load = () => {
    setLoading(true);
    bookingService.getAll().then((res) => setBookings(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await bookingService.cancel(id);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">You haven't made any bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="font-semibold">{b.event?.title}</div>
                <div className="text-sm text-ink/60 dark:text-paper/60">
                  {formatDate(b.event?.startDate)} · {b.event?.venue}
                </div>
                <div className="mt-1 text-sm text-ink/70 dark:text-paper/70">
                  {b.tierName} × {b.quantity} · {formatCurrency(b.totalAmount)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[b.status] || 'bg-ink/10'}`}>
                  {b.status}
                </span>

                {b.status === 'pending' && b.totalAmount > 0 && (
                  <Link to={`/checkout/${b._id}`} className="btn-primary !py-1.5 text-sm">
                    <FiCreditCard /> Pay now
                  </Link>
                )}

                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id}
                    className="btn-outline !py-1.5 text-sm"
                  >
                    <FiXCircle /> {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
