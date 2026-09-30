# SokoSalama Marketplace

SokoSalama is a responsive multi-vendor marketplace demo for Kenyan merchants and shoppers. It brings the public storefront, customer shopping flow, vendor workspace, and platform administration tools together in one React application.

> **Project status:** This repository is a functional UI and API demo backed by an in-memory data store. It is useful for local development and product walkthroughs, but it is not a production commerce service. Data resets when the server restarts, and authentication and payment flows are not a substitute for production identity, payment, or security infrastructure.

## Features

- **Storefront:** Product discovery, category and vendor filtering, product details, merchant directory, deals, cart, and checkout experience.
- **Customer accounts:** Sign in and registration, order history, order tracking, and account navigation.
- **Vendor workspace:** Store overview, product management, order fulfillment, payouts, and dispute views.
- **Admin console:** Financial analytics, vendor insights, KYC and vendor management, product approvals, disputes, payouts, delivery zones, commission rules, audit history, and categorized platform settings.
- **Marketplace UI:** Responsive layouts, glass-style components, editable site branding and announcement bar, and footer trust/contact information.
- **Demo data:** Seeded products, stores, orders, customers, vendors, payouts, and activity for exploring the application.

## Technology

- React 19 and TypeScript
- Vite 8 with Tailwind CSS 4
- Express 4 API server
- Lucide icons and Motion
- In-memory TypeScript data store (`src/services/dataStore.ts`)

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
git clone <repository-url>
cd sokosalama-marketplace
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The `dev` script starts the Express server, which hosts the Vite development middleware and the `/api` routes on the same port. Set `PORT` to use a different port.

No Gemini API key is required to run the marketplace demo. `.env.example` documents optional environment variables used by hosted deployments and payment-credential encryption.

## Demo accounts

Use the email (or phone number) and password below on the Sign In page.

| Role | Email | Password |
| --- | --- | --- |
| System admin | `admin@sokosalama.co.ke` | `admin2026` |
| Customer | `demo.customer@sokosalama.co.ke` | `DemoCustomer2026` |
| Customer | `wambui.k@gmail.com` | `password123` |
| Vendor | `leather@olkaria.co.ke` | `vendor123` |
| Vendor | `rep@kikomeo.co.ke` | `vendor123` |
| Vendor | `orders@mtkenyacoffee.co.ke` | `vendor123` |

These are public demo credentials for local use only. Do not reuse these passwords or seed accounts in a deployed environment.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express and the Vite development server on port 3000. |
| `npm run lint` | Run the TypeScript compiler in check-only mode (`tsc --noEmit`). |
| `npm run build` | Create the optimized frontend bundle in `dist/`. |
| `npm run preview` | Preview the built frontend with Vite (static frontend only). |
| `npm start` | Start the Express server; set `NODE_ENV=production` to serve the built app. |

### Production-style local run

Build first, then start the Express server in production mode.

**PowerShell:**

```powershell
npm run build
$env:NODE_ENV = "production"
npm start
```

**macOS / Linux:**

```bash
npm run build
NODE_ENV=production npm start
```

Then visit [http://localhost:3000](http://localhost:3000), or the port configured by `PORT`.

## Repository map

```text
.
├── server.ts                 # Express API and Vite development/production hosting
├── index.html                # HTML entry point and document metadata
├── src/
│   ├── App.tsx               # Application state and top-level view routing
│   ├── main.tsx              # React entry point
│   ├── components/           # Storefront, account, vendor, and admin UI
│   ├── services/
│   │   ├── apiClient.ts      # Browser API client with local demo fallback
│   │   └── dataStore.ts      # Seeded in-memory demo data and operations
│   └── types/                # Shared TypeScript domain types
├── .env.example              # Optional environment variable reference
└── package.json              # Scripts and dependencies
```

## Configuration

The app runs without a local environment file. For deployment or when saving payment credentials in Admin Settings, configure environment variables in the hosting environment rather than committing secrets:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP server port (defaults to `3000`). |
| `NODE_ENV` | Set to `production` to serve `dist/` from Express. |
| `MARKETPLACE_SETTINGS_ENCRYPTION_KEY` | 64-character hexadecimal key (32 bytes) used to encrypt payment credentials saved through the server API. |
| `APP_URL` | Public app URL for hosted environments. |
| `GEMINI_API_KEY` | Optional AI Studio/deployment secret; not needed for the local marketplace UI. |

## Data and production notes

- The included API and data store are designed for a demo. They use process memory rather than a persistent database; restarting the server resets changes.
- The demo server keeps a single in-memory session and is not suitable for multi-user production traffic.
- Connect a persistent database, production-grade authentication/session management, authorization and tenant isolation, payment-provider callbacks, background jobs, and audit/monitoring infrastructure before handling real customer or vendor data.
- Keep all credentials and encryption keys in a secret manager or server environment. Never put private keys in frontend code or commit them to source control.

## License

No license is currently specified. Add a `LICENSE` file before redistributing this project under an open-source license.
