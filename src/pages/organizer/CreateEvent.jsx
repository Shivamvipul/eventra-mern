import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { eventService } from '../../services/eventService';
import { adminService } from '../../services/adminService';
import { aiService } from '../../services/aiService';

export default function CreateEvent() {
  const { register, control, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      ticketTiers: [{ name: 'General', type: 'free', price: 0, quantity: 50 }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'ticketTiers' });
  const [categories, setCategories] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    adminService.getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const generateDescription = async () => {
    const title = watch('title');
    if (!title) return toast.error('Enter a title first');
    setGenerating(true);
    try {
      const { data } = await aiService.generateDescription({ title, category: 'event', tags: [] });
      setValue('description', data.data.description);
    } catch {
      toast.error('AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (formData, status) => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'ticketTiers') fd.append(key, JSON.stringify(value));
      else fd.append(key, value);
    });
    fd.append('status', status);
    if (bannerFile) fd.append('banner', bannerFile);

    try {
      await eventService.create(fd);
      toast.success(status === 'published' ? 'Submitted for approval!' : 'Draft saved');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl">Create Event</h1>
      <form className="card space-y-5 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input className="input-field" {...register('title', { required: true })} />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium">Description</label>
            <button type="button" onClick={generateDescription} className="flex items-center gap-1 text-xs font-semibold text-primary-500">
              <HiSparkles /> {generating ? 'Generating...' : 'AI generate'}
            </button>
          </div>
          <textarea rows={5} className="input-field" {...register('description', { required: true })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select className="input-field" {...register('category', { required: true })}>
              <option value="">Select...</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Venue</label>
            <input className="input-field" {...register('venue', { required: true })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Start Date</label>
            <input type="datetime-local" className="input-field" {...register('startDate', { required: true })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">End Date</label>
            <input type="datetime-local" className="input-field" {...register('endDate', { required: true })} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Capacity</label>
          <input type="number" className="input-field" {...register('capacity', { required: true, min: 1 })} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Banner Image</label>
          <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} className="text-sm" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium">Ticket Tiers</label>
            <button type="button" onClick={() => append({ name: '', type: 'paid', price: 0, quantity: 10 })} className="flex items-center gap-1 text-xs font-semibold text-primary-500">
              <FiPlus /> Add tier
            </button>
          </div>
          {/* Column headers — shown once above the tier rows so each field's purpose is clear */}
          <div className="mb-1 grid grid-cols-12 gap-2 px-1 text-xs font-semibold text-ink/50 dark:text-paper/50">
            <span className="col-span-4">Tier Name</span>
            <span className="col-span-3">Type</span>
            <span className="col-span-2">Price</span>
            <span className="col-span-2">Quantity</span>
            <span className="col-span-1" />
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2">
                <input placeholder="e.g. General, VIP" className="input-field col-span-4" {...register(`ticketTiers.${index}.name`, { required: true })} />
                <select className="input-field col-span-3" {...register(`ticketTiers.${index}.type`)}>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="vip">VIP</option>
                  <option value="early_bird">Early Bird</option>
                </select>
                <input type="number" placeholder="0" className="input-field col-span-2" {...register(`ticketTiers.${index}.price`, { min: 0 })} />
                <input type="number" placeholder="10" className="input-field col-span-2" {...register(`ticketTiers.${index}.quantity`, { required: true, min: 1 })} />
                <button type="button" onClick={() => remove(index)} className="col-span-1 text-red-500"><FiTrash2 /></button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">
            Note: "Type" is just a label for grouping/reporting — the actual amount charged is whatever you set in "Price", regardless of Type. For a genuinely free tier, set Price to 0.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" disabled={isSubmitting} onClick={handleSubmit((d) => onSubmit(d, 'draft'))} className="btn-outline">
            Save Draft
          </button>
          <button type="button" disabled={isSubmitting} onClick={handleSubmit((d) => onSubmit(d, 'published'))} className="btn-primary">
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
}
