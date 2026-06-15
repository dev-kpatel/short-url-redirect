import pg from 'pg';
import { env } from '@config/env.js';

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
  max: process.env.VERCEL ? 2 : 10,
  idleTimeoutMillis: 10000 // Close idle connections quickly in serverless
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