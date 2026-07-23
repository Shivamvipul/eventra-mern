import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function EventCard({ event }) {
  const lowestPrice = event.ticketTiers?.length ? Math.min(...event.ticketTiers.map((t) => t.price)) : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15 }}
      className="card group overflow-hidden"
    >
      <Link to={`/events/${event.slug || event._id}`}>
        <div className="relative h-44 overflow-hidden bg-primary-100 dark:bg-primary-900">
          {event.banner ? (
            <img src={event.banner} alt={event.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-3xl text-primary-400">EVENTRA</div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-ink">
            {event.category?.name || 'Event'}
          </span>
        </div>

        <div className="ticket-perforation" />

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 text-lg font-semibold">{event.title}</h3>
          <div className="flex items-center gap-2 text-sm text-ink/60 dark:text-paper/60">
            <FiCalendar size={14} /> {formatDate(event.startDate)}
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/60 dark:text-paper/60">
            <FiMapPin size={14} /> <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-sm font-semibold text-primary-500">
              {lowestPrice === 0 ? 'FREE' : `From ${formatCurrency(lowestPrice)}`}
            </span>
            {event.avgRating > 0 && (
              <span className="flex items-center gap-1 text-sm text-accent-600">
                <FiStar size={14} className="fill-current" /> {event.avgRating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
