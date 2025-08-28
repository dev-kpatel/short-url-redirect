import { useState } from "react";
import { Input, Button } from "@components/ui";
import { api } from "@services/api";
import { FormProvider, useForm } from "react-hook-form";
import { validateSlug } from "@shared/lib";

export const RedirectForm = ({ onCreated }: { onCreated: (code: string) => void }) => {
  const methods = useForm();
  const [success, setSuccess] = useState(false)

  const onSubmit = methods.handleSubmit(async (postdata) => {
    try {
      const { data } = await api.post("/links/redirect", postdata);
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
          })} />
        <Input
          type="url"
          id="redirecturl"
          placeholder="https://example.com"
          label="Redirect URL"
          required
          {...methods.register('redirect',
            {
              required: 'Redirect is required',
              pattern: {
                value: /^[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:[^\s]*)$/,
                message: 'not valid url',
              },
            })
          }
        />
        <Input
          type="text"
          id="redirectdesc"
          placeholder="Description"
          label="Description"
          {...methods.register('description')
          }
        />
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
