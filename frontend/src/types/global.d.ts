type LinkType = "redirect" | "ab" | "calendar";

interface Link {
  id: number;
  slug: string;
  type: LinkType;
}

interface Validation {
  value: any;
  message: string;
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
  message: string;
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