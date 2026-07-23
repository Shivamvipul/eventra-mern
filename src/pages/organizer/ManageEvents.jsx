import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../../services/eventService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => eventService.getMine().then((res) => setEvents(res.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const toggleStatus = async (event) => {
    const next = event.status === 'published' ? 'draft' : 'published';
    try {
      await eventService.setStatus(event._id, next);
      toast.success(`Event set to ${next}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm('Delete this event permanently?')) return;
    try {
      await eventService.remove(id);
      toast.success('Event deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl">Manage Events</h1>
        <Link to="/organizer/events/create" className="btn-primary">New Event</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50 dark:border-paper/10 dark:text-paper/50">
              <th className="py-2">Title</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e._id} className="border-b border-ink/5 dark:border-paper/5">
                <td className="py-3 font-medium">{e.title}</td>
                <td>{formatDate(e.startDate)}</td>
                <td>{e.capacity - e.availableSeats}/{e.capacity}</td>
                <td className="capitalize">{e.status.replace('_', ' ')}</td>
                <td className="space-x-2">
                  <button onClick={() => toggleStatus(e)} className="text-primary-500 hover:underline">
                    {e.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteEvent(e._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <p className="py-10 text-center text-ink/50 dark:text-paper/50">No events yet.</p>}
      </div>
    </div>
  );
}
