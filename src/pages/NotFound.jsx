import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-8xl text-primary-500">404</span>
      <h1 className="mt-2 text-2xl">This ticket doesn't exist</h1>
      <p className="mt-2 text-ink/60 dark:text-paper/60">The page you're looking for has been moved or cancelled.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
