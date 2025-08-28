import { Router, Request, Response } from 'express';
import { resolveBySlug } from './resolver.js';
import { pool } from '@db/pool.js';

const router = Router();

router.get('/ab/:slug', async (req: Request, res: Response) => {
  const ctx = {
    slug: req.params.slug,
    now: new Date(),
    ip: req.ip,
    ua: String(req.headers['user-agent'] || '')
  };
  const result = await resolveBySlug(ctx);

  if (result.status === 302) {
    // non-blocking log
    pool.query(
      'UPDATE links SET hits = hits + 1 WHERE id=$1',
      [result.linkId]
    ).catch(() => { });
    // return res.status(result.status).json({ url: result.url });
    return res.redirect(302, result.url);
  }

  return res.status(result.status).json({ error: result.reason });
});

router.get('/c/:t/:slug', async (req: Request, res: Response) => {

  const ctx = {
    slug: req.params.slug,
    now: new Date(),
    target: req.params.t,
    ip: req.ip,
    ua: String(req.headers['user-agent'] || '')
  };

  const result = await resolveBySlug(ctx);

  if (result.status === 302) {
    // non-blocking log
    pool.query(
      'UPDATE links SET hits = hits + 1 WHERE id=$1',
      [result.linkId]
    ).catch(() => { });
    if (ctx.target != "d") {
      return res.redirect(302, result.url);
    } else {
      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${ctx.slug}.ics"`);
      return res.status(200).send(result.url);
    }

  }

  return res.status(result.status).json({ error: result.reason });
});


router.get('/:slug', async (req: Request, res: Response) => {
  const ctx = {
    slug: req.params.slug,
    now: new Date(),
    ip: req.ip,
    ua: String(req.headers['user-agent'] || '')
  };

  const result = await resolveBySlug(ctx);

  if (result.status === 302) {
    // non-blocking log
    pool.query(
      'UPDATE links SET hits = hits + 1 WHERE id=$1',
      [result.linkId]
    ).catch(() => { });
    // return res.status(result.status).json({ url: result.url });
    return res.redirect(302, result.url);
  }

  return res.status(result.status).json({ error: result.reason });
});

export default router;
