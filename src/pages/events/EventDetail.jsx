import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiUsers, FiHeart, FiStar } from 'react-icons/fi';
import { eventService } from '../../services/eventService';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    eventService
      .getById(id)
      .then((res) => {
        setEvent(res.data.data.event);
        setFeedbacks(res.data.data.feedbacks);
        setSelectedTier(res.data.data.event.ticketTiers[0]?.name);
      })
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated) return toast.error('Please log in to book tickets');
    setBooking(true);
    try {
      const { data } = await bookingService.create({ eventId: event._id, tierName: selectedTier, quantity });
      if (data.data.status === 'confirmed') {
        toast.success('Booking confirmed! Check My Tickets.');
        navigate('/participant/tickets');
      } else {
        toast.success('Booking created — proceed to payment.');
        navigate(`/checkout/${data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please log in first');
    try {
      await userService.toggleWishlist(event._id);
      toast.success('Wishlist updated');
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  if (loading) return <Loader label="Loading event..." />;
  if (!event) return <p className="py-16 text-center">Event not found.</p>;

  const tier = event.ticketTiers.find((t) => t.name === selectedTier);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-64 overflow-hidden rounded-xl bg-primary-100 sm:h-96 dark:bg-primary-900">
        {event.banner ? (
          <img src={event.banner} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-4xl text-primary-400">EVENTRA</div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="mb-2 inline-block rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-ink">
            {event.category?.name}
          </span>
          <h1 className="mb-4 text-4xl">{event.title}</h1>

          <div className="mb-6 flex flex-wrap gap-6 text-sm text-ink/70 dark:text-paper/70">
            <span className="flex items-center gap-2"><FiCalendar /> {formatDate(event.startDate)}</span>
            <span className="flex items-center gap-2"><FiMapPin /> {event.venue}</span>
            <span className="flex items-center gap-2"><FiUsers /> {event.availableSeats} seats left</span>
            {event.avgRating > 0 && (
              <span className="flex items-center gap-2 text-accent-600"><FiStar className="fill-current" /> {event.avgRating.toFixed(1)} ({event.ratingCount})</span>
            )}
          </div>

          <div className="ticket-perforation mb-6" />

          <h2 className="mb-3 text-2xl">About this event</h2>
          <p className="whitespace-pre-line text-ink/80 dark:text-paper/80">{event.description}</p>

          <h2 className="mb-4 mt-10 text-2xl">Reviews ({feedbacks.length})</h2>
          <div className="space-y-4">
            {feedbacks.length === 0 && <p className="text-sm text-ink/50 dark:text-paper/50">No reviews yet.</p>}
            {feedbacks.map((f) => (
              <div key={f._id} className="card p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold">{f.user?.name}</span>
                  <span className="flex items-center gap-1 text-accent-600 text-sm"><FiStar className="fill-current" /> {f.rating}</span>
                </div>
                <p className="text-sm text-ink/70 dark:text-paper/70">{f.comment}</p>
                {f.organizerReply && (
                  <div className="ml-4 mt-2 border-l-2 border-primary-300 pl-3 text-sm text-ink/60 dark:text-paper/60">
                    <strong>Organizer:</strong> {f.organizerReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="card sticky top-24 h-fit p-6">
          <h3 className="mb-4 text-lg font-semibold">Get your ticket</h3>

          <div className="mb-4 space-y-2">
            {event.ticketTiers.map((t) => (
              <label key={t.name} className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm ${selectedTier === t.name ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-ink/15 dark:border-paper/15'}`}>
                <span>
                  <input type="radio" className="mr-2" checked={selectedTier === t.name} onChange={() => setSelectedTier(t.name)} />
                  {t.name} <span className="text-ink/50 dark:text-paper/50">({t.quantity - t.sold} left)</span>
                </span>
                <span className="font-mono font-semibold">{t.price === 0 ? 'FREE' : formatCurrency(t.price)}</span>
              </label>
            ))}
          </div>

          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm font-medium">Qty</label>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-field w-20"
            />
          </div>

          <div className="mb-4 flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="font-mono text-lg font-bold">{formatCurrency((tier?.price || 0) * quantity)}</span>
          </div>

          <button onClick={handleBook} disabled={booking} className="btn-primary w-full">
            {booking ? 'Booking...' : tier?.price === 0 ? 'Reserve for Free' : 'Book & Pay'}
          </button>
          <button onClick={toggleWishlist} className="btn-outline mt-2 w-full">
            <FiHeart /> Save to Wishlist
          </button>
        </aside>
      </div>
    </div>
  );
}
