import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload, FiStar } from 'react-icons/fi';
import { ticketService } from '../../services/ticketService';
import Loader from '../../components/common/Loader';
import FeedbackModal from '../../components/common/FeedbackModal';
import { formatDateTime } from '../../utils/helpers';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [ratedEventIds, setRatedEventIds] = useState([]);

  useEffect(() => {
    ticketService.getMine().then((res) => setTickets(res.data.data)).finally(() => setLoading(false));
  }, []);

  // An event is eligible for feedback once its ticket has been used (attendee checked in)
  // or the event's end date has already passed.
  const isFeedbackEligible = (t) => {
    const eventEnded = t.event?.endDate && new Date(t.event.endDate) < new Date();
    return t.isUsed || eventEnded;
  };

  const downloadPdf = async (id) => {
    try {
      const { data } = await ticketService.downloadPdf(id);
      window.open(data.data.pdfUrl, '_blank');
    } catch {
      toast.error('Could not generate PDF');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">You haven't booked any tickets yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((t) => (
            <div key={t._id} className="card overflow-hidden">
              <div className="flex items-center justify-between bg-primary-500 px-4 py-3 text-white">
                <span className="font-mono text-xs">{t.ticketId}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.isUsed ? 'bg-white/20' : 'bg-accent-500 text-ink'}`}>
                  {t.isUsed ? 'USED' : 'VALID'}
                </span>
              </div>
              <div className="ticket-perforation" />
              <div className="p-4">
                <div className="mb-1 font-semibold">{t.event?.title}</div>
                <div className="mb-3 text-sm text-ink/60 dark:text-paper/60">{formatDateTime(t.event?.startDate)} · {t.event?.venue}</div>
                {t.qrCodeImage && <img src={t.qrCodeImage} alt="QR code" className="mx-auto mb-3 h-32 w-32" />}
                <button onClick={() => downloadPdf(t._id)} className="btn-outline w-full !py-1.5 text-sm">
                  <FiDownload /> Download PDF
                </button>
                {isFeedbackEligible(t) && (
                  <button
                    onClick={() => setFeedbackEvent(t.event)}
                    disabled={ratedEventIds.includes(t.event?._id)}
                    className="btn-primary mt-2 w-full !py-1.5 text-sm disabled:opacity-50"
                  >
                    <FiStar /> {ratedEventIds.includes(t.event?._id) ? 'Feedback submitted' : 'Give Feedback'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <FeedbackModal
        open={!!feedbackEvent}
        event={feedbackEvent}
        onClose={() => setFeedbackEvent(null)}
        onSubmitted={() => setRatedEventIds((prev) => [...prev, feedbackEvent._id])}
      />
    </div>
  );
}
