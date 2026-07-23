import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { login } from '../../redux/slices/authSlice';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status } = useSelector((state) => state.auth);

  const onSubmit = async (formData) => {
    try {
      const result = await dispatch(login(formData));

      if (login.fulfilled.match(result)) {
        toast.success('Login successful');

        const userRole = result.payload.role;

        let dashboard = '/';

        if (userRole === 'super_admin') {
          dashboard = '/admin/dashboard';
        } else if (userRole === 'organizer') {
          dashboard = '/organizer/dashboard';
        } else if (userRole === 'participant') {
          dashboard = '/participant/dashboard';
        }

        navigate(
          location.state?.from?.pathname || dashboard,
          { replace: true }
        );

      } else {
        toast.error(result.payload || 'Invalid credentials');
      }

    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };


  return (
    <div>

      <h2 className="mb-1 text-2xl font-semibold">
        Welcome back
      </h2>

      <p className="mb-6 text-sm text-ink/60 dark:text-paper/60">
        Login to book tickets or manage your events.
      </p>


      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="admin@eventplatform.com"
            className="input-field"
            {...register('email', {
              required: 'Email is required',
            })}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>


        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            className="input-field"
            {...register('password', {
              required: 'Password is required',
            })}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}

        </div>


        {/* Forgot password */}
        <div className="text-right">

          <Link
            to="/forgot-password"
            className="text-sm text-primary-500"
          >
            Forgot password?
          </Link>

        </div>


        {/* Login button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full"
        >

          {status === 'loading'
            ? 'Logging in...'
            : 'Log in'}

        </button>


      </form>


      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">

        Don't have an account?{' '}

        <Link
          to="/register"
          className="font-semibold text-primary-500"
        >
          Sign up
        </Link>

      </p>


    </div>
  );
}