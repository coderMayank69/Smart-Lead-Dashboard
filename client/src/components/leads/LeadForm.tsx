// src/components/leads/LeadForm.tsx — Clean lead create/edit form

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../utils/constants';
import type { Lead } from '../../types';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.string().min(1, 'Pick a status'),
  source: z.string().min(1, 'Pick a source'),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormValues) => Promise<boolean>;
  isSubmitting: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      status: initialData?.status ?? 'New',
      source: initialData?.source ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        source: initialData.source,
        notes: initialData.notes ?? '',
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (values: LeadFormValues) => {
    const ok = await onSubmit(values);
    if (ok && !initialData) reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Jane Smith"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="jane@company.com"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          required
          options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Source"
          required
          placeholder="Select..."
          options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Notes</label>
        <textarea
          className="input-base"
          rows={3}
          placeholder="Optional notes about this lead..."
          style={{ resize: 'vertical' }}
          {...register('notes')}
        />
      </div>

      <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
