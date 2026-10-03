# OMOR FX — Quotex Real Market & OTC Market Trading Analysis System

<p align="center">
  <strong>Smart Signals · Better Decisions</strong><br>
  A high-performance trading signal, technical analysis, and market data visualization dashboard engineered for Quotex Real Market and OTC Market analysis.
</p>

---

## 🌟 Overview & Capabilities

OMOR FX provides deterministic, multi-factor market analysis with strict separation between **Real Market** (Twelve Data) and **OTC Market** (OTCharts / Quotex OTC).

### Core Features
- **Strict Market Separation**:
  - **Real Market**: Connected to Twelve Data. Features EUR/USD, GBP/USD, USD/JPY, XAU/USD, AUD/USD, USD/CAD, BTC/USD. Enforces minimum 1-minute temporal resolution (sub-minute frames are blocked per market rules).
  - **OTC Market**: Connected to OTCharts Quotex OTC order book. Features Quotex OTC pairs with high-frequency second-level resolutions (5s, 10s, 30s) alongside standard intervals (1m, 2m, 3m, 5m).
- **Deterministic Signal Engine**:
  - Indicators: EMA 9 / EMA 21 trend cross, RSI 14 momentum & divergence, MACD histogram, Bollinger Bands (20, 2), Average True Range (ATR) volatility filtering, and candlestick pattern recognition (Doji, Hammer, Engulfing).
  - Clear categorical outcomes: `UP`, `DOWN`, `WAIT`, `AVOID`, `NO_SIGNAL`.
- **TradingView Lightweight Charts™**:
  - Hardware-accelerated candlestick charting with moving average line overlays, dynamic volume histograms, crosshair price tracking, and compliant attribution.
- **AI Voice Alerts**:
  - Browser Speech Synthesis engine announcing new signals in English and Bengali (`bn-BD`).
  - Strict deduplication: signals are announced only once and suppressed if expired.
- **Persistent Signal History**:
  - Stored in browser IndexedDB (with fallback to localStorage).
  - Search, filter by market (Real/OTC), date range, and instrument.
  - CSV export for trading journal records.
  - Real-time settlement verification: wins, losses, and ties are resolved against authoritative reference prices.
- **Calibrated Confidence**:
  - Model confidence is calibrated against empirical historical test datasets; never promises profits or guaranteed accuracy.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion.
- **Visualization**: TradingView Lightweight Charts (`lightweight-charts` v5).
- **Backend / Proxy**: Node.js, Express, tsx.
- **Testing**: Vitest automated test suite.
- **Storage**: IndexedDB & LocalStorage.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/your-username/omor-fx.git
cd omor-fx
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and optionally set your API keys:
```env
# Optional: Twelve Data API key for Real Market live data
TWELVE_DATA_API_KEY="YOUR_KEY_HERE"

# Optional: OTCharts token for Quotex OTC live data
OTCHARTS_API_KEY="YOUR_TOKEN_HERE"
```
> **Note**: If no API keys are provided, OMOR FX automatically activates its high-fidelity **Simulated Testing Engine**, generating realistic live ticks and candlestick data with clear visual markers.

### 4. Run Development Server
```bash
npm run dev
```
The full-stack application will be available at `http://localhost:3000`.

### 5. Run Automated Tests
```bash
npm test
```

---

## 🔒 Security & API Key Best Practices

- **Never Commit Secrets**: Real API keys must never be committed to Git or pushed to GitHub.
- **Server Proxy Architecture**: The included `server.ts` proxies requests to Twelve Data and OTCharts so that secrets remain server-side and are never exposed in client bundles.
- **In-App Testing**: Users can also configure session keys in the **Settings** view, which are used for client-side API requests without exposing them to other users.

---

## 📦 Deployment Options

### Option A: Free Serverless Deployment (Render / Railway / Fly.io)
Deploy the full-stack Express + Vite application:
1. Connect your GitHub repository to Render or Railway.
2. Build command: `npm run build`
3. Start command: `npm start`
4. Configure environment variables (`TWELVE_DATA_API_KEY`, `OTCHARTS_API_KEY`) in the host's dashboard.

### Option B: Static SPA Deployment (Vercel / Netlify / Cloudflare Pages)
If deploying purely as a client-side SPA:
1. Build command: `npm run build`
2. Output directory: `dist`
3. Users can input their individual Twelve Data or OTCharts keys directly in the Settings view or run in simulation mode.

---

## ⚖️ Disclaimer

OMOR FX is a technical signal analysis and market education tool. It is **not** an automated trading bot and does **not** execute trades directly on broker accounts. Past performance does not guarantee future results.
