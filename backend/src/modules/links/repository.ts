import { Queryable } from '@db/pool.js';
import { Link, LinkType, AbVariant, CalendarRule, AbVariantInput, CalendarEventInput } from './types.js';

export async function isSlugTaken(db: Queryable, slug: string): Promise<number> {
  const { rows } = await db.query("SELECT 1 FROM links WHERE slug=$1 LIMIT 1", [slug]);
  return rows.length;
}

export async function findLinks(db: Queryable, type: string): Promise<Link[]> {
  const q = await db.query(
    'SELECT id, type, slug, redirect, description, hits, created, updated FROM links WHERE type=$1',
    [type]
  );
  return q.rows || null;
}

export async function findLinkBySlug(db: Queryable, slug: string): Promise<Link> {
  const q = await db.query(
    'SELECT id, type, slug, redirect, description, hits, created, updated FROM links WHERE slug=$1 LIMIT 1',
    [slug]
  );
  return q.rows[0] || null;
}

export async function insertLink(db: Queryable, type: LinkType, slug: string, redirect:string, description?: string | null): Promise<Link> {
  const q = await db.query(
    'INSERT INTO links (type, slug, redirect, description) VALUES ($1,$2,$3,$4) RETURNING id, type, slug, description, created, updated',
    [type, slug, redirect, description ?? null]
  );
  return q.rows[0] as Link;
}

export async function insertAbVariant(db: Queryable, short_id: number, data: AbVariantInput): Promise<AbVariant> {
  const q = await db.query(
    `INSERT INTO experiment (short_id, name, redirect, weight)
     VALUES ($1,$2,$3,$4)
     RETURNING id, short_id, name, redirect, weight`,
    [short_id, data.name, data.redirect, data.weight]
  );
  return q.rows[0] as AbVariant;
}

export async function listAbVariants(db: Queryable, short_id: number): Promise<AbVariant[]> {
  const q = await db.query(
    'SELECT id, short_id, name, redirect, weight FROM experiment WHERE short_id=$1',
    [short_id]
  );
  return q.rows as AbVariant[];
}

export async function insertCalendarRule(db: Queryable, short_id:number, data: CalendarEventInput): Promise<CalendarRule> {
  const q = await db.query(
    `INSERT INTO calendar (short_id, name, description, start_date, end_date, location, recurrence, frequency, rinterval, rcount)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING short_id, name, description, start_date, end_date, location`,
    [short_id, data.name, data.description, data.start_date, data.end_date, data.location, data.recurrence ? 1 : 0, data.frequency, data.rinterval, data.rcount]
  );
  return q.rows[0] as CalendarRule;
}

export async function findCalendarMatch(db: Queryable, short_id: number, tsIso: string): Promise<CalendarRule | null> {
  const q = await db.query(
    `SELECT id, short_id, start_date, end_date, url
       FROM calendar
      WHERE short_id=$1
        AND $2::timestamptz >= start_date
        AND $2::timestamptz <  end_date
      ORDER BY start_date DESC
      LIMIT 1`,
    [short_id, tsIso]
  );
  return q.rows[0] || null;
}

export async function logClick(db: Queryable, linkid: number): Promise<void> {
  await db.query(
    `UPDATE links SET hits = hits + 1 WHERE id=$1`,
    [linkid]
  );
}
