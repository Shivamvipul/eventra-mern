import React from 'react';

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-40 bg-ink/10 dark:bg-paper/10" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-1/2 rounded bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-1/3 rounded bg-ink/10 dark:bg-paper/10" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return <div className="h-12 w-full animate-pulse rounded bg-ink/10 dark:bg-paper/10" />;
}
