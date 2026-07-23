import React from 'react';

export default function EventFilters({ categories, filters, onChange }) {
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <select
        value={filters.category || ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="input-field w-auto"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <select
        value={filters.sortBy || '-createdAt'}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
        className="input-field w-auto"
      >
        <option value="-createdAt">Newest</option>
        <option value="startDate">Upcoming first</option>
        <option value="-views">Most popular</option>
      </select>

      <input
        type="number"
        placeholder="Max price"
        value={filters.maxPrice || ''}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
        className="input-field w-32"
      />
    </div>
  );
}
