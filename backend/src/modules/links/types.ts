export type LinkType = 'redirect' | 'ab' | 'calendar';

export interface Link {
  id: number;
  type: LinkType;
  slug: string;
  redirect: string | AbVariant[];
  description: string;
  hits: number;
  created: Date;   // ISO from DB
  created_by: number;
  updated: Date;   // ISO from DB
  updated_by: number;
}

// A/B
export interface AbVariant extends AbVariantInput {
  id: number;
  short_id: number;
  hits: number;
  status:number;
  created: Date;   // ISO from DB
}

// Calendar
export interface CalendarRule extends CalendarEventInput {
  id: number;
  short_id: number;
  created: Date;   // ISO from DB
}

// DTOs for creation
export interface CreateRedirectDTO { slug: string; redirect: string; description?: string; }
export interface AbVariantInput { name:string; redirect: string; weight: number; }
export interface CreateAbDTO { slug: string; description: string; variations: AbVariantInput[]; }
export interface CalendarEventInput { name: string; description: string | null; start_date: string;  end_date: string; location: string; recurrence: number; frequency :string; rinterval: number; rcount:number; }
export interface CreateCalendarDTO { slug: string; description?: string; event: CalendarEventInput; }
