import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../redux/slices/notificationSlice';
import { notificationService } from '../services/notificationService';
import { formatDateTime } from '../utils/helpers';

export default function Notifications() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    dispatch(fetchNotifications());
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl">Notifications</h1>
        <button onClick={markAllRead} className="text-sm font-semibold text-primary-500">Mark all read</button>
      </div>
      <div className="space-y-2">
        {list.map((n, i) => (
          <div key={n._id || i} className={`card p-4 ${!n.isRead ? 'border-l-4 border-primary-500' : ''}`}>
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-ink/60 dark:text-paper/60">{n.message}</div>
            <div className="mt-1 text-xs text-ink/40 dark:text-paper/40">{formatDateTime(n.createdAt)}</div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-ink/50 dark:text-paper/50">No notifications yet.</p>}
      </div>
    </div>
  );
}
