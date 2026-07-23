import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatDateTime } from '../../utils/helpers';

export default function SystemAnalytics() {
  const [audit, setAudit] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getAuditLogs(), adminService.getActivityLogs()])
      .then(([a, b]) => { setAudit(a.data.data); setActivity(b.data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <h2 className="mb-4 text-2xl">Audit Logs</h2>
        <div className="space-y-2">
          {audit.map((a) => (
            <div key={a._id} className="card p-3 text-sm">
              <span className="font-semibold">{a.actor?.name}</span> — {a.action} — <span className="text-ink/50 dark:text-paper/50">{formatDateTime(a.createdAt)}</span>
            </div>
          ))}
          {audit.length === 0 && <p className="text-sm text-ink/50 dark:text-paper/50">No audit logs.</p>}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-2xl">Activity Logs</h2>
        <div className="space-y-2">
          {activity.map((a) => (
            <div key={a._id} className="card p-3 text-sm">
              <span className="font-semibold">{a.user?.name}</span> — {a.activity} — <span className="text-ink/50 dark:text-paper/50">{formatDateTime(a.createdAt)}</span>
            </div>
          ))}
          {activity.length === 0 && <p className="text-sm text-ink/50 dark:text-paper/50">No activity logs.</p>}
        </div>
      </div>
    </div>
  );
}
