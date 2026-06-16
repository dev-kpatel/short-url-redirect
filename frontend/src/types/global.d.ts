type LinkType = "redirect" | "ab" | "calendar";

interface Link {
  id: number;
  slug: string;
  type: LinkType;
}

interface Validation {
  value: string | number | boolean | RegExp;
  message: string;
}

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Field {
  name: string;
  label: string;
  type: string;
  id: string;
  placeholder: string;
  validation?: {
    required?: Validation;
    maxLength?: Validation;
    minLength?: Validation;
    pattern?: Validation;
  }
}

interface Variations {
  id?:number;
  name: string;
  redirect: string;
}

interface InputErrorProps {
  message?: string;
}


interface LinkRow {
  id: number;
  type: LinkType;
  slug: string;
  description:string;
  hits: number | null;
  redirect: string | Variations[]; // for simple
  created: string;
};