import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import Loader from '../../components/common/Loader';

export default function Wishlist() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getProfile()
      .then(async (res) => {
        const ids = res.data.data.wishlist || [];
        const results = await Promise.all(ids.map((id) => eventService.getById(id).then((r) => r.data.data.event).catch(() => null)));
        setEvents(results.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">Wishlist</h1>
      {events.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">Nothing saved yet — tap the heart on any event to add it here.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => <EventCard key={e._id} event={e} />)}
        </div>
      )}
    </div>
  );
}
