import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

export default app;