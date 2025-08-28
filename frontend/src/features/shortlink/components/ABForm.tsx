import { useState } from "react";
import { Input, Button } from "@components/ui";
import { api } from "@services/api";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import { validateSlug } from "@shared/lib";

export const AbForm = ({ onCreated }: { onCreated: (code: string) => void }) => {
  const methods = useForm();
  const [success, setSuccess] = useState(false)
  const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'variations',
      });


  const onSubmit = methods.handleSubmit(async (postdata) => {
    try {
      const { data } = await api.post("/links/ab", postdata);
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

  // Remove variation
  const handleRemoveClick = (index:number) => {
    remove(index);
  };

  // Add variation
  const handleAddClick = () => {
    const variation:Variations = {name:'', redirect:''};
    append(variation);
  };

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
          id="redirectdesc"
          placeholder="Description"
          label="Description"
          {...methods.register('description')}
        />
        <Button type="button" onClick={handleAddClick} className="btn-sm"><Plus className="h-4"/> Add Variation</Button>
        {fields.length > 0 && <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-3">
              <div className="sm:col-span-2">Variation Name</div>
              <div className="sm:col-span-3">Variation URL</div>
        </div> }
        {fields.map((field, i) => (
          <div key={field.id}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 gap-6 mt-4 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50" key={field.id}>
              <div className="sm:col-span-2">
                  <Input
                    id={`vname${i}`}
                    placeholder="E.g V1 or Variation 1 or Campaign Name"
                    required
                    {...methods.register(`variations.${i}.name`, {
                      required: 'Variation name is required'
                    })}
                  />
              </div>
              <div className="sm:col-span-3">
                  <Input
                    type="url"
                    id={`vurl${i}`}
                    placeholder="E.g https://example.com/2025/xxxx"
                    required
                    {...methods.register(`variations.${i}.redirect`,
                      {
                        required: 'Variation URL is required',
                        pattern: {
                          value: /^[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:[^\s]*)$/,
                          message: 'not valid url',
                        },
                      })
                    }
                  />
              </div>
              <div className="sm:col-span-1">
              <Button type="button" variant="ghost" className="border border-dashed border-gray-300 text-indigo rounded mt-3 py-3"
                onClick={() => handleRemoveClick(i)}><Minus className="h-4"/></Button>
            </div>
            </div>
          </div>
        ))}
        {success && (
          <p className="font-semibold text-green-500 mb-5 flex items-center gap-1">
            Form has been submitted successfully
          </p>
        )}
        { fields.length > 1 && <Button type="submit" onClick={onSubmit} className="w-auto">Create</Button> }
      </form>
    </FormProvider>
  );
}
