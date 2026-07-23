import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../redux/slices/eventSlice';
import EventCard from '../../components/events/EventCard';
import EventFilters from '../../components/events/EventFilters';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import { CardSkeleton } from '../../components/common/Skeleton';
import { adminService } from '../../services/adminService';

export default function EventList() {
  const dispatch = useDispatch();
  const { list, meta, status } = useSelector((s) => s.events);
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    page: 1,
  });

  useEffect(() => {
    adminService.getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    dispatch(fetchEvents(filters));
  }, [dispatch, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl">Browse Events</h1>

      <div className="mb-6 space-y-4">
        <SearchBar defaultValue={filters.search} onSearch={(search) => setFilters((f) => ({ ...f, search, page: 1 }))} />
        <EventFilters categories={categories} filters={filters} onChange={(f) => setFilters({ ...f, page: 1 })} />
      </div>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <p className="py-16 text-center text-ink/60 dark:text-paper/60">No events match your filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => <EventCard key={e._id} event={e} />)}
        </div>
      )}

      <Pagination page={meta.page} pages={meta.pages} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}
