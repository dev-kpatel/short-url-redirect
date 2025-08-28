import { useState } from "react";
import { Input, Select, Button } from "@components/ui";
import { api } from "@services/api";
import { FormProvider, useForm } from "react-hook-form";
import { Calendar, MapPin, AlignLeft } from 'lucide-react';
import { validateSlug } from "@shared/lib";

export const CalendarForm = ({ onCreated }: { onCreated: (code: string) => void }) => {
  const methods = useForm();
  const [success, setSuccess] = useState(false)
  const isRecurrent:any = methods.watch('event.recurrence');


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
        className="space-y-3 rounded border border-gray-300 bg-white p-4 shadow-lg"
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
          {...methods.register('description')
          }
        />
        <h3 className="font-bold">Event Details</h3>
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
                placeholder="e.g. Office Building A or zoom link or meet link"
                required
                {...methods.register('event.location', { required: 'Location is required' })}
                className="pl-9"
              />
              <MapPin className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 mt-4 text-gray-400" />
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  id="startDate"
                  label="Start Date"
                  type="datetime-local"
                  required
                  {...methods.register('event.start_date', { required: 'Start date is required' })}
                  className="pr-9"
                />
                <Calendar className="absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 mt-4 text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  id="endDate"
                  label="End Date"
                  type="datetime-local"
                  required
                  {...methods.register('event.end_date', { required: 'End date is required' })}
                  className="pr-9"
                />
                <Calendar className="absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 mt-4 text-gray-400" />
              </div>
            </div>

            {/* Description (as a textarea for now) */}
            <div className="relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter event details..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                {...methods.register('event.description')}
              />
              <AlignLeft className="absolute top-8 left-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Recurrence Checkbox */}
            <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="isRecurrent"
                    type="checkbox"
                    aria-describedby="isRecurrent"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-indigo/10 checked:border-indigo-500 checked:bg-indigo-500 indeterminate:border-indigo-500 indeterminate:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:border-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
                    {...methods.register('event.recurrence')}
                   />
                  <svg viewBox="0 0 14 14" fill="none" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25">
                    <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-checked:opacity-100" />
                    <path d="M3 7H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-indeterminate:opacity-100" />
                  </svg>
                </div>
              </div>
              <div className="text-sm/6">
                <label htmlFor="isRecurrent" className="font-medium">Recurrence Event</label>
              </div>
            </div>
            {/* Conditional Recurrence Fields */}
            {isRecurrent && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-4 border border-dashed rounded-md bg-gray-50">

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
          <p className="font-semibold text-green-500 mb-5 flex items-center gap-1">
            Form has been submitted successfully
          </p>
        )}
        <Button type="submit" onClick={onSubmit} className="w-auto">Create</Button>
      </form>
    </FormProvider>
  );
}
