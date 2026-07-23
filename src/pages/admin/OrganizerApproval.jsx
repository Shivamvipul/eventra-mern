import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';

export default function OrganizerApproval() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => adminService.getPendingOrganizers().then((res) => setOrganizers(res.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const decide = async (id, approve) => {
    try {
      await adminService.approveOrganizer(id, approve);
      toast.success(approve ? 'Organizer approved' : 'Organizer rejected');
      load();
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">Organizer Approval</h1>
      {organizers.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">No pending organizer applications.</p>
      ) : (
        <div className="space-y-3">
          {organizers.map((o) => (
            <div key={o._id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-semibold">{o.name}</div>
                <div className="text-sm text-ink/60 dark:text-paper/60">{o.email}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => decide(o._id, true)} className="btn-primary !py-1.5 !px-4 text-sm">Approve</button>
                <button onClick={() => decide(o._id, false)} className="btn-outline !py-1.5 !px-4 text-sm">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
