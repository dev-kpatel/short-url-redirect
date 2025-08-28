import { ResolverStrategy } from '../types.js';
import { pool } from '@db/pool.js';

export const abStrategy: ResolverStrategy = {
  type: 'ab',
  async resolve(_ctx, link) {
    const { rows } = await pool.query(
      `SELECT id, short_id, weight, redirect, hits
        FROM experiment
        WHERE short_id=$1`,
      [link.id]
    );
    if (!rows.length) return { status: 500, reason: 'no_variants'};
    const index = link.hits % rows.length; // gives 0, 1, or 2 ... in round-robin order
    const variant = rows[index];
    if(variant){
      pool.query(
        'UPDATE experiment SET hits = hits + 1 WHERE id=$1',
        [variant.id]
      ).catch(() => { });
      return { status: 302, url: variant.redirect, linkId: link.id }
    }
    return { status: 500, reason: 'ab_pick_failed' };
  }
};