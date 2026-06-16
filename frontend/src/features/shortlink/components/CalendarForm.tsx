import { useState } from "react";
import { Input, Select, Button, DateTimePicker } from "@components/ui";
import { api } from "@services/api";
import { FormProvider, useForm } from "react-hook-form";
import { Calendar, MapPin, AlignLeft } from 'lucide-react';
import { validateSlug } from "@shared/lib";

interface CalendarFormValues {
  slug: string;
  description: string;
  event: {
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
    recurrence: boolean;
    frequency?: string;
    rinterval?: number;
    rcount?: number;
  };
}

export const CalendarForm = ({ onCreated }: { onCreated: (code: string) => void }) => {
  const methods = useForm<CalendarFormValues>({
    defaultValues: {
      slug: "",
      description: "",
      event: {
        name: "",
        location: "",
        start_date: "",
        end_date: "",
        description: "",
        recurrence: false,
        frequency: "",
        rinterval: 1,
        rcount: 1,
      },
    },
  });
  const [success, setSuccess] = useState(false);
  const isRecurrent = methods.watch('event.recurrence');


  const onSubmit = methods.handleSubmit(async (postdata) => {
    try {
      const { data } = await api.post("/links/calendar", postdata);
      onCreated(data.code);
      methods.reset();
      setSuccess(true);
    } catch (error) {
      // Handle API call errors here
      console.error("Failed to create short URL:", error);
      // You might also set an error state for the UI
      setSuccess(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className="space-y-4 p-6 bg-card text-foreground"
      >
        <Input
          id="redirectslug"
          placeholder="e.g abcd"
          required
          label="Slug"
          {...methods.register('slug', {
            required: 'Slug is required',
            minLength: {
              value:3,
              message:'Slug must be 3 char long'
            },
            maxLength:{
              value:7,
              message:'Slug must not be 7 char long'
            },
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: 'Slug can not have special char.',
            },
            validate: validateSlug
          })}  />
        <Input
          type="text"
          placeholder="Description"
          id="redirectdesc"
          label="Description"
          {...methods.register('description')}
        />
        <h3 className="font-display font-bold text-sm tracking-wide text-muted-foreground uppercase border-b border-border pb-1 mt-4">Event Details</h3>
        <Input
              id="eventName"
              label="Event Name"
              placeholder="e.g. Team Sync Meeting"
              required
              {...methods.register('event.name', { required: 'Event name is required' })}
            />

            {/* Location */}
            <div className="relative">
              <Input
                id="eventLocation"
                label="Location"
                placeholder="e.g. meet.google.com/abc"
                required
                {...methods.register('event.location', { required: 'Location is required' })}
                className="pl-10"
              />
              <MapPin className="absolute left-3.5 bottom-3.5 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateTimePicker
                id="startDate"
                label="Start Date"
                name="event.start_date"
                required
              />
              <DateTimePicker
                id="endDate"
                label="End Date"
                name="event.end_date"
                required
              />
            </div>

            {/* Description (textarea) */}
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-semibold tracking-wide text-foreground">
                Event Description
              </label>
              <div className="relative mt-1.5">
                <textarea
                  id="description"
                  placeholder="Enter event details..."
                  className="block w-full rounded-xl border border-border bg-card text-foreground pl-10 pr-4 py-2 text-sm shadow-sm focus:border-lime-brand focus:ring-1 focus:ring-lime-brand/20 outline-none transition-all duration-200 min-h-20"
                  {...methods.register('event.description')}
                />
                <AlignLeft className="absolute top-3 left-3.5 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Recurrence Checkbox */}
            <div className="flex items-center gap-2.5 py-1">
              <div className="flex h-5 shrink-0 items-center">
                <div className="group grid h-4 w-4 grid-cols-1">
                  <input
                    id="isRecurrent"
                    type="checkbox"
                    aria-describedby="isRecurrent"
                    className="col-start-1 row-start-1 appearance-none rounded-md border border-border bg-card checked:border-lime-brand checked:bg-lime-brand focus:outline-none focus:ring-2 focus:ring-lime-brand/20 cursor-pointer h-4 w-4"
                    {...methods.register('event.recurrence')}
                   />
                  <svg viewBox="0 0 14 14" fill="none" className="pointer-events-none col-start-1 row-start-1 h-3 w-3 self-center justify-self-center stroke-primary-foreground group-has-disabled:stroke-white/25">
                    <path d="M3 8L6 11L11 3.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-checked:opacity-100" />
                    <path d="M3 7H11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-indeterminate:opacity-100" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-semibold text-foreground">
                <label htmlFor="isRecurrent" className="cursor-pointer">Recurrence Event</label>
              </div>
            </div>

            {/* Conditional Recurrence Fields */}
            {isRecurrent && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-4 border border-dashed border-border rounded-2xl bg-muted/20">
                <Select
                  id="recType"
                  label="Repeat Type"
                  required
                  {...methods.register('event.frequency', { required: 'Recurrence type is required' })}
                >
                  <option value="">Select...</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>

                <Input
                  id="recInterval"
                  label="Repeat Interval"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  {...methods.register('event.rinterval', { required: 'Repeat interval is required', min: { value: 1, message: 'Must be at least 1' } })}
                />

                <Input
                  id="recLimit"
                  label="Recurrence Count"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                  {...methods.register('event.rcount', { required: 'Recurrence count is required', min: { value: 1, message: 'Must be at least 1' } })}
                />
              </div>
            )}
        {success && (
          <p className="font-semibold text-lime-brand mb-5 flex items-center gap-1">
            Form has been submitted successfully
          </p>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border mt-6">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            ⚡ Demo Notice: Created links are automatically deleted after 24 hours.
          </span>
          <Button type="submit" onClick={onSubmit} className="w-auto">Create</Button>
        </div>
      </form>
    </FormProvider>
  );
}
