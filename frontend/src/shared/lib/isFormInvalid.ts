import { FieldErrors } from "react-hook-form";

export const isFormInvalid = (errors: FieldErrors): boolean => {
  return Object.keys(errors).length > 0;
};