import { FieldErrors, FieldError } from "react-hook-form";

export const findInputError = (errors: FieldErrors, path: string | undefined): FieldError | undefined => {
  if (!path) return undefined;

  let current: unknown = errors;
  for (const part of path.split('.')) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  if (
    current &&
    typeof current === "object" &&
    ("type" in current || "message" in current)
  ) {
    return current as FieldError;
  }

  return undefined;
};
