import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Check your email</h2>
        <p className="text-sm text-ink/60 dark:text-paper/60">If that email exists, a reset link is on its way.</p>
        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-primary-500">Back to login</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Forgot password</h2>
      <p className="mb-6 text-sm text-ink/60 dark:text-paper/60">We'll email you a link to reset it.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="email" placeholder="you@example.com" className="input-field" {...register('email', { required: true })} />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
}
