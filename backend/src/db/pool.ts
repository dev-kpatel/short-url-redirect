import pg from 'pg';
import { env } from '@config/env.js';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL
});

export type Queryable = {
  query: (text: string, params?: unknown[]) => Promise<pg.QueryResult<any>>;
};

export async function tx<T>(fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}