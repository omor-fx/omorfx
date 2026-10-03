import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // 1. Health & Status Route
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'online',
      serverTime: Date.now(),
      serverUtc: new Date().toISOString(),
      providers: {
        twelveData: {
          hasEnvKey: !!process.env.TWELVE_DATA_API_KEY,
          mode: process.env.TWELVE_DATA_API_KEY ? 'live' : 'simulated_fallback',
        },
        otCharts: {
          hasEnvKey: !!process.env.OTCHARTS_API_KEY,
          mode: process.env.OTCHARTS_API_KEY ? 'live' : 'simulated_fallback',
        },
      },
    });
  });

  // 2. Twelve Data Secure Server Proxy
  app.get('/api/twelve-data/time_series', async (req, res) => {
    try {
      const apiKey = (req.headers['x-api-key'] as string) || process.env.TWELVE_DATA_API_KEY;
      const symbol = req.query.symbol as string;
      const interval = (req.query.interval as string) || '1min';
      const outputsize = (req.query.outputsize as string) || '60';

      if (!apiKey) {
        return res.status(400).json({
          status: 'error',
          message: 'No Twelve Data API key configured in server environment or request header.',
        });
      }

      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      return res.status(response.status).json(data);
    } catch (err: any) {
      console.error('Twelve Data proxy error:', err);
      return res.status(500).json({ status: 'error', message: err.message || 'Proxy request failed' });
    }
  });

  // 3. OTCharts Quotex OTC Proxy
  app.get('/api/otcharts/candles', async (req, res) => {
    try {
      const apiKey = (req.headers['x-api-key'] as string) || process.env.OTCHARTS_API_KEY;
      const pair = req.query.pair as string;
      const tf = (req.query.tf as string) || '1m';

      if (!apiKey) {
        return res.status(400).json({
          status: 'error',
          message: 'No OTCharts API key configured in server environment or request header.',
        });
      }

      const url = `https://api.otcharts.com/v1/quotex/candles?pair=${encodeURIComponent(pair)}&tf=${tf}&token=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      return res.status(response.status).json(data);
    } catch (err: any) {
      console.error('OTCharts proxy error:', err);
      return res.status(500).json({ status: 'error', message: err.message || 'Proxy request failed' });
    }
  });

  // Attach Vite middleware in dev or static files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`OMOR FX Server listening on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
