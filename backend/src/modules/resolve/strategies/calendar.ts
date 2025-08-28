import { ResolverStrategy, Target } from '../types.js';
import { pool } from '@db/pool.js';
import { buildGoogleUrl, buildYahooUrl, buildOutlookUrl, buildIcs } from "./url-builders.js";


export const calendarStrategy: ResolverStrategy = {
  type: 'calendar',
  async resolve(ctx, link) {
    const t = (ctx.target || "").toLowerCase() as Target;

    if (!["g", "y", "o", "d"].includes(t)) {
      return { status: 404, reason: 'Invalid target code' };
    }

    const { rows } = await pool.query(
      `SELECT name, description, start_date, end_date, location, recurrence, frequency, rinterval, rcount
        FROM calendar
        WHERE short_id=$1
        LIMIT 1`,
      [link.id]
    );
    const ev = rows[0];
    if (!ev) return { status: 404, reason: 'Event not found' };

  // Normalize values
    const event = {
      slug: ev.slug as string,
      title: ev.name as string,
      description: (ev.description as string) ?? "",
      location: (ev.location as string) ?? "",
      start: new Date(ev.start_date),
      end: new Date(ev.end_date),
      tz: (ev.timezone as string) || "UTC",
      recurrence: ev.timezone as boolean,
      frequency: ev.timezone as string,
      rinterval: ev.timezone as number,
      rcount: ev.timezone as number
    };

    try {
      switch (t) {
        case "g": {
          const url = buildGoogleUrl(event);
          return { status: 302, url: url, linkId: link.id }
        }
        case "y": {
          const url = buildYahooUrl(event);
          return { status: 302, url: url, linkId: link.id }
        }
        case "o": {
          const url = buildOutlookUrl(event);
          return { status: 302, url: url, linkId: link.id }
        }
        case "d": {
          const ics = buildIcs(event);
          return { status: 302, url: ics, linkId: link.id }
          // res.setHeader("Content-Type", "text/calendar; charset=utf-8");
          // res.setHeader("Content-Disposition", `attachment; filename="${event.slug}.ics"`);
          // return res.status(200).send(ics);
        }
      }
    } catch (e: any) {
      console.error("calendar redirect error:", e);
      return { status: 500, reason: "Failed to generate link" }
    }

  }
};