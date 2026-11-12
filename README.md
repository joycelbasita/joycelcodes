# ClickBites — React + Node.js

React (Vite) front end + Express (Node.js) server, converted from the original plain HTML/CSS/JS site.
Data, login and photos still live in **Supabase** (same project, same tables, same RPCs), so everything
the old site did still works: customers, shop owners, admins, verified receipt-code reviews, favorites,
photo uploads, 15-minute idle logout for owners/admins.

```
clickbites/
├─ package.json            root scripts (dev / build / start)
├─ server/index.js         Express: serves the built React app, /api/health, SPA fallback
├─ database/               optional SQL (review_authors view)
└─ client/                 React app (Vite)
   ├─ .env                 Supabase URL + publishable key
   ├─ public/              logo.jpg, 3.jpg, logos/, banners/
   └─ src/
      ├─ main.jsx, App.jsx           routing, page guards, body classes
      ├─ index.css                   the original stylesheet, unchanged
      ├─ context/AppContext.jsx      Supabase data layer + shared state/actions
      ├─ lib/                        supabase client, helpers
      ├─ components/                 Layout, Cards, SearchBox, QuickViewModal, Icon, ui
      └─ pages/                      Home, Search, Shops, Shop, Auth, Review, Profile, Owner, Admin
```

## Run it
Requires Node.js 18+.

```bash
npm install            # installs the server and (via postinstall) the client
npm run dev            # Express on :3000 + Vite on http://localhost:5173
```

Production:

```bash
npm run build          # builds client/dist
npm start              # Express serves the app on http://localhost:3000
```

## Configuration
`client/.env` (copy of `client/.env.example`):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Only the *publishable* key belongs here (it is safe in the browser). Never put a `service_role` key in `client/`.
Vite bakes these values in at build time, so rebuild after changing them.

## Supabase setup (unchanged from the HTML version)
1. Authentication → Email: enabled, **Confirm email ON**, min password length 8.
2. Email templates (Confirm signup + Reset password): include `{{ .Token }}` so the email shows the code.
3. OTP expiration: 300 seconds.
4. URL Configuration: set Site URL to where you run the site (e.g. `http://localhost:5173`, or your deployed URL) and add it to Redirect URLs.
5. SMTP: connect your own SMTP for anything beyond a small demo.
6. Run `database/supabase-review-authors.sql` once (SQL Editor) so reviews can show reviewer names and photos.
   Also run `database/supabase-shop-banner.sql` once so shop owners can upload their own banner photo.
7. The `create-owner` Edge Function (used by Admin → Shops & owners) must be deployed in the Supabase project.
   It was not part of the uploaded zip; the old README says it is already deployed.

## What changed from the HTML version
- `script.js` (string templates + global event delegation) → React components, hooks and context.
- Hash routes are kept (`#/shop/3`, `#/owner/products`, …) via `HashRouter`, so the host needs no rewrite rules.
- Supabase library is now the npm package instead of a CDN script; `config.js` → `.env`.
- Node/Express serves the build and gives you a place to add server-only endpoints under `/api`.
- Behavior, validation messages, roles and CSS class names are preserved.
