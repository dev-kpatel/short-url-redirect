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
          id="redirectdesc"
          placeholder="Description"
          label="Description"
          {...methods.register('description')}
        />
        {fields.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground mt-4 px-2">
              <div className="sm:col-span-2">Variation Name</div>
              <div className="sm:col-span-3">Variation URL</div>
        </div> }
        {fields.map((field, i) => (
          <div key={field.id}>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-end mt-2 p-4 border border-dashed border-border rounded-2xl bg-muted/20" key={field.id}>
              <div className="sm:col-span-2">
                  <Input
                    id={`vname${i}`}
                    placeholder="E.g. V1"
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
                    placeholder="E.g. https://example.com/v1"
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
              <Button type="button" variant="ghost" className="w-full border border-dashed border-border text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl py-2.5"
                onClick={() => handleRemoveClick(i)}><Minus className="h-4 w-4"/></Button>
            </div>
            </div>
          </div>
        ))}
        <Button 
          type="button" 
          variant="ghost" 
          onClick={handleAddClick} 
          className="w-full border border-dashed border-border hover:border-lime-brand/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground mt-3 py-3 flex items-center justify-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Variant
        </Button>
        {success && (
          <p className="font-semibold text-lime-brand mt-4 flex items-center gap-1">
            Form has been submitted successfully
          </p>
        )}
        {fields.length > 1 && (
          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <Button type="submit" onClick={onSubmit} className="w-auto">
              Create Link
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
