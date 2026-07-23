import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { eventService } from '../../services/eventService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

export default function EventApproval() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminService.getPendingEvents().then((res) => setEvents(res.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await eventService.approve(id);
      toast.success('Event approved and published');
      load();
    } catch {
      toast.error('Approval failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">Event Approval</h1>
      {events.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">No events awaiting approval.</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e._id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-sm text-ink/60 dark:text-paper/60">by {e.organizer?.name} · {formatDate(e.startDate)}</div>
              </div>
              <button onClick={() => approve(e._id)} className="btn-primary !py-1.5 !px-4 text-sm">Approve & Publish</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
