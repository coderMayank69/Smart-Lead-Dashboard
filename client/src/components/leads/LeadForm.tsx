// Create/Edit lead form — resets whenever initialData changes so editing
// different leads doesn't carry over stale field values.

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import type { Lead, CreateLeadPayload } from '../../types';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../utils/constants';

// Client-side form schema (mirrors server validation)
const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().max(500, 'Notes max 500 characters').optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadPayload) => Promise<boolean>;
  isLoading?: boolean;
  initialData?: Lead;
}

const STATUS_OPTIONS = LEAD_STATUSES.map((s) => ({ value: s, label: s }));
const SOURCE_OPTIONS = LEAD_SOURCES.map((s) => ({ value: s, label: s }));

export const LeadForm: React.FC<LeadFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { status: 'New', notes: '' },
  });

  // BUG FIX: useForm defaultValues are only applied on mount.
  // When initialData changes (e.g. user clicks Edit on a different lead),
  // we must explicitly reset the form to the new values.
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        status: initialData.status,
        source: initialData.source,
        notes: initialData.notes ?? '',
      });
    } else {
      reset({ status: 'New', notes: '' });
    }
  }, [initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (values: LeadFormValues) => {
    const success = await onSubmit(values as CreateLeadPayload);
    if (success) handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Lead' : 'Create New Lead'}
      description={
        isEditing
          ? 'Update the lead information below'
          : 'Fill in the details to add a new lead'
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Rahul Sharma"
            required
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="rahul@example.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            {...register('status')}
          />
          <Select
            label="Source"
            options={SOURCE_OPTIONS}
            placeholder="Select source"
            required
            error={errors.source?.message}
            {...register('source')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Notes
          </label>
          <textarea
            className="input-base resize-none h-24"
            placeholder="Add any relevant notes about this lead..."
            {...register('notes')}
          />
          {errors.notes && (
            <p className="mt-1.5 text-xs text-red-600">⚠ {errors.notes.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isLoading}
          >
            {isEditing ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
