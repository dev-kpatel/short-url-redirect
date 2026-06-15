import pg from 'pg';
import { env } from '../config/env.js';

// Strip any sslmode or ssl query parameters from the connection string to prevent pg
// from overwriting our explicit ssl configuration object.
const sanitizedConnectionString = env.DATABASE_URL
  .replace(/[?&]sslmode=[^&]+/g, '')
  .replace(/[?&]ssl=[^&]+/g, '');

const isLocal = sanitizedConnectionString.includes('localhost') || sanitizedConnectionString.includes('127.0.0.1');

export const pool = new pg.Pool({
  connectionString: sanitizedConnectionString,
  ssl: isLocal
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