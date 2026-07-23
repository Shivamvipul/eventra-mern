import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';
import Modal from './Modal';
import { feedbackService } from '../../services/feedbackService';

export default function FeedbackModal({ open, onClose, event, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setSuggestion('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    try {
      await feedbackService.create({ eventId: event._id, rating, comment, suggestion });
      toast.success('Thanks for your feedback!');
      onSubmitted?.();
      handleClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Could not submit feedback';
      toast.error(
        err.response?.status === 409 || /already/i.test(message)
          ? "You've already submitted feedback for this event"
          : message
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Modal open={open} onClose={handleClose} title={`Rate: ${event.title}`}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Your rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${n} star`}
                className="p-0.5"
              >
                <FiStar
                  size={28}
                  className={
                    n <= (hoverRating || rating)
                      ? 'fill-current text-accent-500'
                      : 'text-ink/20 dark:text-paper/20'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="input-field w-full"
            placeholder="How was your experience?"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Suggestion (optional)</label>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            rows={2}
            className="input-field w-full"
            placeholder="Anything the organizer could improve?"
          />
        </div>

        <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </Modal>
  );
}
