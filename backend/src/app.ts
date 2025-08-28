import express from 'express';
import cors from 'cors';
import linksRoutes from '@modules/links/routes.js';
import resolveRouter from '@modules/resolve/router.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/healthz', (_req, res) => res.json({ ok: true }));

  // Admin APIs
  app.use('/api/links', linksRoutes);

  // Public redirect
  app.use('/', resolveRouter);

  return app;
}
