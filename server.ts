import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes/api';
import { initDb } from './server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Seed / Initialize Database
  initDb();

  // Basic production hardening. Keep upload payloads bounded.
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
  const authAttempts = new Map<string, { count: number; resetAt: number }>();
  app.use('/api/auth', (req, res, next) => {
    if (req.method !== 'POST' || !['/login', '/register'].includes(req.path)) return next();
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const current = authAttempts.get(key);
    if (!current || current.resetAt <= now) authAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    else if (current.count >= 20) return res.status(429).json({ success: false, message: 'Too many attempts. Please try again in 15 minutes.' });
    else current.count += 1;
    next();
  });
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Static uploads directory
  const uploadsDir = path.resolve(process.env.ZENVI_UPLOADS_DIR || path.join(process.cwd(), 'uploads'));
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Mount REST APIs
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'ZENVI',
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProd) {
    // In development: Mount Vite middlewares for seamless HMR and fast dev experience
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: Serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ZENVI Full-Stack Server running at http://localhost:${PORT}`);
    console.log(`📡 REST API endpoints active at http://localhost:${PORT}/api`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting ZENVI server:', err);
  process.exit(1);
});
