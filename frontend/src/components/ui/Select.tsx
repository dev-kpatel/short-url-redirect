import { forwardRef, SelectHTMLAttributes } from "react";
import { cn, findInputError } from '@shared/lib'
import { useFormContext } from 'react-hook-form'
import { InputError } from "./InputError";
import { ChevronDown } from "lucide-react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, label, children, ...props },
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
              message={inputErrors?.message}
              key={inputErrors?.message}
            />
          )}
        </div>
      </div>
      <div className="relative mt-1.5 w-full">
        <select
          ref={ref}
          id={id} // Setting the id on the input for accessibility
          className={cn(
            "block w-full appearance-none rounded-xl border px-3.5 pr-10 py-2 text-sm shadow-sm transition-all duration-200 outline-none h-11",
            "bg-card text-foreground border-border",
            "focus:border-lime-brand focus:ring-1 focus:ring-lime-brand/20",
            isInvalid ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
});