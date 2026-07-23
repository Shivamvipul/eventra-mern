import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { registerUser } from '../../redux/slices/authSlice';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: 'participant' },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Check your email to verify.');
      navigate('/login');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Create your account</h2>
      <p className="mb-6 text-sm text-ink/60 dark:text-paper/60">Book tickets or host your own events.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input className="input-field" {...register('name', { required: true })} />
          {errors.name && <p className="mt-1 text-xs text-red-500">Name is required</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className="input-field" {...register('email', { required: true })} />
          {errors.email && <p className="mt-1 text-xs text-red-500">Email is required</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className="input-field" {...register('password', { required: true, minLength: 6 })} />
          {errors.password && <p className="mt-1 text-xs text-red-500">Minimum 6 characters</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">I want to</label>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" value="participant" {...register('role')} /> Attend events
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="organizer" {...register('role')} /> Host events
            </label>
          </div>
          {watch('role') === 'organizer' && (
            <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">Organizer accounts require admin approval before publishing.</p>
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        Already have an account? <Link to="/login" className="font-semibold text-primary-500">Log in</Link>
      </p>
    </div>
  );
}
