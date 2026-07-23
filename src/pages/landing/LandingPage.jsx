import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiCalendar, FiTrendingUp, FiStar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured } from '../../redux/slices/eventSlice';
import EventCard from '../../components/events/EventCard';
import { CardSkeleton } from '../../components/common/Skeleton';
import { CATEGORY_ICONS } from '../../utils/constants';

const STATS = [
  { label: 'Events hosted', value: '2,400+', icon: <FiCalendar /> },
  { label: 'Attendees connected', value: '180K+', icon: <FiUsers /> },
  { label: 'Avg. satisfaction', value: '4.8/5', icon: <FiStar /> },
  { label: 'Organizer revenue', value: '$3.2M+', icon: <FiTrendingUp /> },
];

const TESTIMONIALS = [
  { name: 'Priya N.', role: 'Hackathon Organizer', quote: 'Ticketing and check-in used to eat a whole weekend. Now it runs itself.' },
  { name: 'Marcus D.', role: 'Workshop Attendee', quote: 'Booking took two taps and my QR ticket was in my inbox before I closed the page.' },
  { name: 'Lena K.', role: 'Conference Producer', quote: 'The live seat counter alone paid for the platform in avoided overselling.' },
];

const FAQS = [
  { q: 'Is Eventra free for attendees?', a: 'Browsing and booking free events is always free. Paid events show the ticket price up front, with no hidden fees.' },
  { q: 'How do I become an organizer?', a: 'Sign up and select "Organizer" — your account is reviewed and approved before you can publish events.' },
  { q: 'How does check-in work?', a: 'Every ticket includes a unique QR code. Organizers scan it at the door for instant, duplicate-proof check-in.' },
];

export default function LandingPage() {
  const dispatch = useDispatch();
  const { featured, upcoming, status } = useSelector((s) => s.events);
  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-500 text-white">
        <div className="absolute inset-0 opacity-10 bg-perforation bg-[length:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-4 inline-block rounded-full border border-white/30 px-4 py-1 font-mono text-xs tracking-widest">
              ADMIT ONE — EVERY EVENT, ONE PLATFORM
            </span>
            <h1 className="max-w-3xl font-display text-6xl leading-tight tracking-wide sm:text-7xl">
              Your ticket to what's happening next.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Discover hackathons, workshops, and summits — or run your own with booking, QR check-in, and live analytics built in.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/events" className="btn-accent">
                Browse Events <FiArrowRight />
              </Link>
              <Link to="/register" className="rounded-lg border-2 border-white px-5 py-2.5 font-semibold transition hover:bg-white hover:text-primary-500">
                Host an Event
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink/10 dark:border-paper/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-900">
                {s.icon}
              </div>
              <div className="font-display text-3xl">{s.value}</div>
              <div className="text-sm text-ink/60 dark:text-paper/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl">Browse by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {Object.entries(CATEGORY_ICONS).map(([name, icon]) => (
            <Link
              key={name}
              to={`/events?category=${name.toLowerCase()}`}
              className="card flex flex-col items-center gap-2 p-5 text-center transition hover:border-primary-500"
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-surface-light py-16 dark:bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl">Featured events</h2>
            <Link to="/events" className="flex items-center gap-1 text-sm font-semibold text-primary-500">
              View all <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {status === 'idle' || status === 'loading'
              ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
              : featured.map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl">Upcoming events</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.slice(0, 4).map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl">What people are saying</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl bg-white/5 p-6">
                <p className="mb-4 text-white/85">"{t.quote}"</p>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-white/60">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-ink/50 dark:text-paper/50">Trusted by teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-display text-2xl text-ink/30 dark:text-paper/30">
          <span>NORTHBRIDGE</span><span>ORBITAL</span><span>FERNDALE</span><span>KESTREL</span><span>ATLAS CO.</span>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-surface-light py-16 dark:bg-surface-dark">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
                <p className="mt-2 text-sm text-ink/70 dark:text-paper/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Contact */}
      <section id="contact" className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-3xl">Never miss what's next</h2>
        <p className="mb-6 text-ink/60 dark:text-paper/60">Get the best new events in your inbox, once a week.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail('');
          }}
          className="mx-auto flex max-w-md gap-2"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-field"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
