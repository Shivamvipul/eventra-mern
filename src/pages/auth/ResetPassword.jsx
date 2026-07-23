import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function ResetPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link invalid or expired');
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p>Missing reset token.</p>
        <Link to="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-primary-500">Request a new link</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Set a new password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="password" placeholder="New password" className="input-field" {...register('password', { required: true, minLength: 6 })} />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </div>
  );
}
