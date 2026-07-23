import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { fetchCurrentUser } from '../../redux/slices/authSlice';

export default function Profile() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone },
  });

  const onSubmit = async (data) => {
    try {
      await userService.updateProfile(data);
      dispatch(fetchCurrentUser());
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-3xl">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="input-field" {...register('name')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="input-field opacity-60" value={user?.email} disabled />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input className="input-field" {...register('phone')} />
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
