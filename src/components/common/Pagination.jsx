import React from 'react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-paper/15"
      >
        Prev
      </button>
      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`h-8 w-8 rounded-lg text-sm ${n === page ? 'bg-primary-500 text-white' : 'border border-ink/15 dark:border-paper/15'}`}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-paper/15"
      >
        Next
      </button>
    </div>
  );
}
