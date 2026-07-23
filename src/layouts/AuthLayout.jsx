import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light px-4 dark:bg-canvas-dark">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-display text-4xl tracking-wider text-primary-500">
          EVENTRA
        </Link>
        <div className="card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
