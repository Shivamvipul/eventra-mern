import React from 'react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      <p className="text-sm text-ink/60 dark:text-paper/60">{label}</p>
    </div>
  );
}
