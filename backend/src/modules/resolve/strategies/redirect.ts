import { ResolverStrategy } from '../types.js';
import { pool } from '@db/pool.js';

export const redirectStrategy: ResolverStrategy = {
  type: 'redirect',
  async resolve(_ctx, link) {
    // const { rows } = await pool.query(
    //   'SELECT url FROM links WHERE link_id=$1', [link.id]
    // );
    if (!link.redirect) return { status: 500, reason: 'no_redirect_target' };
    return { status: 302, url: link.redirect, linkId: link.id };
  }
};