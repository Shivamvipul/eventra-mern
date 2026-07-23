import React, { useEffect, useState } from 'react';
import { FiUserCheck, FiPercent } from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';
import { eventService } from '../../services/eventService';
import { connectSocket } from '../../services/socketService';
import Loader from '../../components/common/Loader';
import { formatDateTime } from '../../utils/helpers';

export default function Attendees() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getMine().then((res) => {
      setEvents(res.data.data);
      if (res.data.data.length) setEventId(res.data.data[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (eventId) attendanceService.getLogs(eventId).then((res) => setLogs(res.data.data));
  }, [eventId]);

  // Live check-ins: join the event's socket room and refresh the log whenever the
  // scanner marks a new attendee, so this list updates without a manual refresh.
  useEffect(() => {
    if (!eventId) return;
    const socket = connectSocket();

    socket.emit('join:event', eventId);
    const handleCheckIn = (payload) => {
      if (payload.eventId !== eventId) return;
      attendanceService.getLogs(eventId).then((res) => setLogs(res.data.data));
    };
    socket.on('attendance:checkedIn', handleCheckIn);

    return () => {
      socket.emit('leave:event', eventId);
      socket.off('attendance:checkedIn', handleCheckIn);
    };
  }, [eventId]);

  if (loading) return <Loader />;

  const selectedEvent = events.find((e) => e._id === eventId);
  const ticketsSold = selectedEvent ? selectedEvent.capacity - selectedEvent.availableSeats : 0;
  const checkedIn = logs.length;
  const attendanceRate = ticketsSold > 0 ? Math.round((checkedIn / ticketsSold) * 100) : 0;

  return (
    <div>
      <h1 className="mb-6 text-3xl">Attendees</h1>
      <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="input-field mb-6 w-auto">
        {events.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
      </select>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <FiUserCheck className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">{checkedIn}</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Checked in</div>
        </div>
        <div className="card p-5">
          <div className="mb-2 text-primary-500 text-xs font-semibold uppercase tracking-wide">Tickets sold</div>
          <div className="text-2xl font-semibold">{ticketsSold}</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Total expected</div>
        </div>
        <div className="card p-5">
          <FiPercent className="mb-2 text-primary-500" size={22} />
          <div className="text-2xl font-semibold">{attendanceRate}%</div>
          <div className="text-sm text-ink/60 dark:text-paper/60">Attendance rate</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50 dark:border-paper/10 dark:text-paper/50">
              <th className="py-2">Attendee</th>
              <th>Ticket</th>
              <th>Checked in</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id} className="border-b border-ink/5 dark:border-paper/5">
                <td className="py-3">{l.user?.name}</td>
                <td className="font-mono text-xs">{l.ticket?.ticketId}</td>
                <td>{formatDateTime(l.checkInTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="py-10 text-center text-ink/50 dark:text-paper/50">No check-ins yet.</p>}
      </div>
    </div>
  );
}
