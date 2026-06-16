import { forwardRef, InputHTMLAttributes } from "react";
import { cn, findInputError } from '@shared/lib'
import { useFormContext } from 'react-hook-form'
import { InputError } from "./InputError";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, ...props },
  ref
) {
  // Accessing name and id from the props object
  const { name, id } = props;
  const { formState: { errors } } = useFormContext();
  const inputErrors = findInputError(errors, name); // Using the name prop here
  const isInvalid = !!inputErrors;

  return (
    <div className="block w-full">
      <div className="flex justify-between">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold tracking-wide text-foreground">
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
      <input
        ref={ref}
        id={id} // Setting the id on the input for accessibility
        className={cn(
          "w-full rounded-xl border px-3.5 py-2 text-sm shadow-sm mt-1.5 transition-all duration-200 outline-none h-11",
          "bg-card text-foreground border-border",
          "focus:border-lime-brand focus:ring-1 focus:ring-lime-brand/20",
          isInvalid ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
          className
        )}
        {...props}
      />
    </div>
  );
});