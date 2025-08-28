import { Router, Request, Response } from 'express';
import { createRedirect, createAb, createCalendar, getLinks, checkSlug} from './service.js';

const router = Router();

router.get("/slug/:slug/available", async (req: Request, res: Response) => {
  const slug = String(req.params.slug.trim().toLowerCase());
  if (!slug) return res.status(400).json({ error: "missing slug" });

  try {
    const taken = await checkSlug(slug);
    res.json({ slug: slug, available: !taken });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/:type', async (req: Request, res: Response) => {
  const type:string = req.params.type;
  try {
    const out = await getLinks(type);
    res.json(out);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/redirect', async (req: Request, res: Response) => {
  try {
    const out = await createRedirect(req.body);
    res.json({ slug: out.slug, type: out.type });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/ab', async (req: Request, res: Response) => {
  try {
    const out = await createAb(req.body);
    res.json({ slug: out.slug, type: out.type });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/calendar', async (req: Request, res: Response) => {
  try {
    const out = await createCalendar(req.body);
    res.json({ slug: out.slug, type: out.type });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
