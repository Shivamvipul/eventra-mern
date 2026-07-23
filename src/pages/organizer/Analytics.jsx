import React, { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { analyticsService } from '../../services/analyticsService';
import { reportService } from '../../services/reportService';
import LineChartComp from '../../components/charts/LineChartComp';
import BarChartComp from '../../components/charts/BarChartComp';
import PieChartComp from '../../components/charts/PieChartComp';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiDownload, FiTrendingUp, FiUserCheck, FiTag, FiClock } from 'react-icons/fi';

const HOUR_LABEL = (h) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [granularity, setGranularity] = useState('day');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [trends, setTrends] = useState([]);
  const [attendance, setAttendance] = useState({ overall: {}, perEvent: [] });
  const [categories, setCategories] = useState([]);
  const [timings, setTimings] = useState({ byHour: [], byDayOfWeek: [], peakHour: null, peakDay: null });

  // Load the organizer's events once, to populate the event filter dropdown
  useEffect(() => {
    eventService.getMine().then((res) => setEvents(res.data.data)).catch(() => {});
  }, []);

  // Re-fetch every analysis whenever the event filter or trend granularity changes
  useEffect(() => {
    const params = eventId ? { eventId } : {};
    setRefreshing(true);

    Promise.all([
      analyticsService.registrationTrends({ ...params, granularity }),
      analyticsService.attendanceRatio(params),
      analyticsService.popularCategories(params),
      analyticsService.peakRegistrationTimings(params),
    ])
      .then(([trendRes, attendanceRes, categoryRes, timingRes]) => {
        setTrends(trendRes.data.data.trends);
        setAttendance(attendanceRes.data.data);
        setCategories(categoryRes.data.data);
        setTimings(timingRes.data.data);
      })
      .catch(() => toast.error('Could not load analytics'))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, [eventId, granularity]);

  const downloadReport = async (type, format) => {
    try {
      const { data } = await reportService.generate(type, format, eventId);
      window.open(data.data.fileUrl, '_blank');
    } catch {
      toast.error('Report generation failed');
    }
  };

  if (loading) return <Loader label="Crunching participation data..." />;

  const byHourFull = Array.from({ length: 24 }, (_, h) => {
    const found = timings.byHour.find((b) => b.hour === h);
    return found ? found.registrations : 0;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Event Participation Analytics</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="input-field !w-auto !py-1.5 text-sm"
          >
            <option value="">All my events</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['revenue', 'attendance', 'booking', 'feedback', 'popular_events'].map((type) => (
          <button key={type} onClick={() => downloadReport(type, 'pdf')} className="btn-outline !py-1.5 !px-3 text-xs capitalize">
            <FiDownload size={12} /> {type.replace('_', ' ')} PDF
          </button>
        ))}
      </div>

      <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${refreshing ? 'opacity-60' : ''}`}>
        {/* 1. Registration trends */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold"><FiTrendingUp className="text-primary-500" /> Registration Trends</h3>
            <div className="flex gap-1">
              {['day', 'week', 'month'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`rounded-full px-3 py-1 text-xs capitalize ${granularity === g ? 'bg-primary-500 text-white' : 'bg-ink/5 dark:bg-paper/10'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          {trends.length ? (
            <LineChartComp labels={trends.map((t) => t.period)} data={trends.map((t) => t.registrations)} label="Registrations" />
          ) : (
            <p className="py-8 text-center text-sm text-ink/50 dark:text-paper/50">No registrations in this range yet.</p>
          )}
        </div>

        {/* 2. Attendance ratio */}
        <div className="card p-5">
          <h3 className="mb-1 flex items-center gap-2 font-semibold"><FiUserCheck className="text-primary-500" /> Attendance Ratio</h3>
          <p className="mb-4 text-sm text-ink/60 dark:text-paper/60">
            {attendance.overall?.attended || 0} of {attendance.overall?.registered || 0} registrants checked in
            <span className="ml-2 font-semibold text-primary-500">({attendance.overall?.attendanceRatio || 0}%)</span>
          </p>
          {attendance.perEvent?.length ? (
            <BarChartComp
              labels={attendance.perEvent.map((e) => e.eventTitle)}
              data={attendance.perEvent.map((e) => e.attendanceRatio)}
              label="Attendance %"
              color="#059669"
            />
          ) : (
            <p className="py-8 text-center text-sm text-ink/50 dark:text-paper/50">No confirmed bookings yet.</p>
          )}
        </div>

        {/* 3. Popular event categories */}
        <div className="card p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold"><FiTag className="text-primary-500" /> Popular Event Categories</h3>
          {categories.length ? (
            <PieChartComp labels={categories.map((c) => c.categoryName)} data={categories.map((c) => c.totalRegistrations)} />
          ) : (
            <p className="py-8 text-center text-sm text-ink/50 dark:text-paper/50">No category data yet.</p>
          )}
        </div>

        {/* 4. Peak registration timings */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-1 flex items-center gap-2 font-semibold"><FiClock className="text-primary-500" /> Peak Registration Timings</h3>
          <p className="mb-4 text-sm text-ink/60 dark:text-paper/60">
            {timings.peakHour && (
              <>Busiest hour: <span className="font-semibold text-primary-500">{HOUR_LABEL(timings.peakHour.hour)}</span>{' '}</>
            )}
            {timings.peakDay && (
              <>· Busiest day: <span className="font-semibold text-primary-500">{timings.peakDay.dayName}</span></>
            )}
          </p>
          <BarChartComp
            labels={Array.from({ length: 24 }, (_, h) => HOUR_LABEL(h))}
            data={byHourFull}
            label="Registrations by hour"
            color="#A855F7"
          />
        </div>
      </div>
    </div>
  );
}
