import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiStar, FiCornerUpLeft, FiSmile, FiMeh, FiFrown } from 'react-icons/fi';
import { feedbackService } from '../../services/feedbackService';
import { eventService } from '../../services/eventService';
import Loader from '../../components/common/Loader';
import { formatDateTime } from '../../utils/helpers';

const SENTIMENT_ICON = {
  positive: <FiSmile className="text-emerald-500" />,
  neutral: <FiMeh className="text-amber-500" />,
  negative: <FiFrown className="text-red-500" />,
};

export default function Feedback() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    eventService.getMine().then((res) => {
      setEvents(res.data.data);
      if (res.data.data.length) setEventId(res.data.data[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (eventId) {
      feedbackService.getForEvent(eventId).then((res) => setFeedback(res.data.data));
    }
  }, [eventId]);

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
    : '—';

  const submitReply = async (id) => {
    const reply = replyDrafts[id];
    if (!reply?.trim()) return toast.error('Write a reply first');
    setSavingId(id);
    try {
      const { data } = await feedbackService.reply(id, reply);
      setFeedback((prev) => prev.map((f) => (f._id === id ? { ...f, organizerReply: data.data.organizerReply } : f)));
      toast.success('Reply posted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post reply');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl">Feedback</h1>

      {events.length === 0 ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">Create an event to start collecting feedback.</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="input-field w-auto">
              {events.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}
            </select>
            <div className="card flex items-center gap-2 px-4 py-2">
              <FiStar className="fill-current text-accent-500" />
              <span className="font-semibold">{avgRating}</span>
              <span className="text-sm text-ink/60 dark:text-paper/60">avg · {feedback.length} reviews</span>
            </div>
          </div>

          <div className="space-y-4">
            {feedback.length === 0 && (
              <p className="py-10 text-center text-sm text-ink/50 dark:text-paper/50">No feedback for this event yet.</p>
            )}
            {feedback.map((f) => (
              <div key={f._id} className="card p-5">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{f.user?.name}</span>
                    <span className="flex items-center gap-1 text-sm text-accent-600">
                      <FiStar className="fill-current" /> {f.rating}
                    </span>
                    {f.sentiment && (
                      <span className="flex items-center gap-1 text-xs capitalize text-ink/60 dark:text-paper/60">
                        {SENTIMENT_ICON[f.sentiment]} {f.sentiment}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-ink/40 dark:text-paper/40">{formatDateTime(f.createdAt)}</span>
                </div>

                {f.comment && <p className="mt-2 text-sm text-ink/80 dark:text-paper/80">{f.comment}</p>}
                {f.suggestion && (
                  <p className="mt-1 text-sm italic text-ink/60 dark:text-paper/60">Suggestion: {f.suggestion}</p>
                )}

                {f.organizerReply ? (
                  <div className="ml-4 mt-3 border-l-2 border-primary-300 pl-3 text-sm text-ink/70 dark:text-paper/70">
                    <strong>Your reply:</strong> {f.organizerReply}
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={replyDrafts[f._id] || ''}
                      onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [f._id]: e.target.value }))}
                      className="input-field flex-1"
                      placeholder="Write a reply..."
                    />
                    <button
                      onClick={() => submitReply(f._id)}
                      disabled={savingId === f._id}
                      className="btn-outline whitespace-nowrap"
                    >
                      <FiCornerUpLeft /> Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
