export type ResolveResult =
  | { status: 302; url: string; linkId: number }
  | { status: 404; reason: string }
  | { status: 500; reason: string };

export interface ResolveContext {
  slug: string;
  now: Date;
  target?: string;
  ip?: string;
  ua?: string;
}

export interface ResolverStrategy<TLinkRow = any> {
  type: 'redirect' | 'ab' | 'calendar';
  resolve(ctx: ResolveContext, link: TLinkRow): Promise<ResolveResult>;
}

export type Target = "g" | "y" | "o" | "d";

export interface CalendarEvent {
  slug: string;
  title: string;
  description: string;
  location: string;
  start: Date;   // UTC Date
  end: Date;     // UTC Date
  tz: string;    // e.g. 'Asia/Kolkata' (used for Google ctz)
  recurrence:boolean;
  frequency:string;
  rinterval:number;
  rcount:number;
};