import { forwardRef, SelectHTMLAttributes } from "react";
import { cn, findInputError } from '@shared/lib'
import { useFormContext } from 'react-hook-form'
import { InputError } from "./InputError";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Input(
  { className, label, ...props },
  ref
) {
  // Accessing name and id from the props object
  const { name, id } = props;
  const { formState: { errors } } = useFormContext();
  const inputErrors:any = findInputError(errors, name) // Using the name prop here
  const isInvalid = !!inputErrors;

  return (
    <div className="block w-full">
      <div className="flex justify-between">
        {label && (
          <label htmlFor={id} className="block text-md font-medium text-gray-700">
            {label}
          </label>
        )}

        <div>
          {isInvalid && (
            <InputError
              message={inputErrors.message}
              key={inputErrors.message}
            />
          )}
        </div>
      </div>
      <select
        ref={ref}
        id={id} // Setting the id on the input for accessibility
        className={cn(
          "w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm mt-2",
          "focus:border-indigo-500 focus:ring-indigo-500",
          isInvalid ? "border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
    </div>
  );
});