import { pool } from '@db/pool.js';
import { ResolveContext, ResolveResult, ResolverStrategy } from './types.js';
import { redirectStrategy } from './strategies/redirect.js';
import { abStrategy } from './strategies/ab.js';
import { calendarStrategy } from './strategies/calendar.js';

const registry: Record<string, ResolverStrategy> = {
  redirect: redirectStrategy,
  ab: abStrategy,
  calendar: calendarStrategy
};

export async function resolveBySlug(ctx: ResolveContext): Promise<ResolveResult> {
  const { rows } = await pool.query('SELECT id, type, hits, redirect FROM links WHERE LOWER(slug)=LOWER($1) LIMIT 1', [ctx.slug]);
  const link = rows[0];
  if (!link) return { status: 404, reason: 'not_found' };

  const strategy = registry[link.type];
  if (!strategy) return { status: 500, reason: `no_strategy_${link.type}` };

  return strategy.resolve(ctx, link);
}
