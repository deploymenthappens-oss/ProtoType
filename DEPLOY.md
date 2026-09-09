# Deploying to Railway

This repo is a small Express server that serves the storefront and admin
pages, injecting your Supabase credentials from environment variables at
request time — no keys are baked into the HTML files themselves.

## What's in here
```
server.js          # Express server, injects env vars into the pages below
package.json        # start script + dependency (express)
railway.json         # Railway build/deploy config (healthcheck etc.)
public/index.html    # storefront (guest checkout, cart, order tracking)
public/admin.html    # admin dashboard (Supabase Auth login required)
sql/schema.sql       # run this in Supabase once — tables, security, functions
.env.example          # reference for the two env vars you need
```

## 1. Set up Supabase (once)
1. Create a project at supabase.com.
2. **SQL Editor** → paste all of `sql/schema.sql` → Run.
3. **Authentication → Users → Add user** — create your admin login (email + password).
4. **Settings → API** — copy the **Project URL** and **anon public** key. You'll paste these into Railway, not into any file.

## 2. Deploy to Railway
1. Push this folder to a GitHub repo (or use `railway up` from the CLI directly from this folder).
2. In Railway: **New Project → Deploy from GitHub repo** (or confirm the CLI deploy).
3. Railway auto-detects Node via `package.json` and runs `npm install && npm start`. No Dockerfile needed.
4. Go to your service's **Variables** tab and add:
   ```
   SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
   ```
   (Don't set `PORT` — Railway provides it automatically and the server reads it.)
5. Deploy. Railway gives you a public URL, e.g. `https://your-app.up.railway.app`.
   - Storefront: `https://your-app.up.railway.app/`
   - Admin: `https://your-app.up.railway.app/admin`
6. Optional: **Settings → Networking → Custom Domain** to attach your own domain.

## 3. Verify it's working
- Visit `/healthz` — should return `ok` (this is what Railway's healthcheck polls).
- Visit `/` — view page source and confirm `SUPABASE_URL` is your real project URL, not a placeholder.
- Place a test order as a guest, then use "Track order" with the code shown on the confirmation screen.
- Sign into `/admin` with the user you created in step 1.3, and confirm the test order shows up.

## Notes
- The Supabase **anon** key is meant to be public (it's what every client-side Supabase app ships) — RLS and the two security-definer functions (`create_order`, `get_order_status`) are what actually keep data safe, not hiding this key.
- To update the site later, just push new commits — Railway redeploys automatically if you've connected a GitHub repo.
- Local testing: `cp .env.example .env`, fill in real values, `npm install`, `npm start`, then open `http://localhost:3000`.
