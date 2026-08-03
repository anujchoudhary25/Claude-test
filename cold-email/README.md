# Cold Email Tracker

A self-contained cold outreach system: manage brand/lead lists, send personalized
emails through your own Gmail account, and automatically track sends, replies,
and reply rate — without touching a spreadsheet.

Lives entirely under `cold-email/`, independent of the marketing site in the
rest of this repo.

## How it works

- **Leads** — add brands one at a time or bulk-import a CSV.
- **Templates** — write a subject/body once with `{{brand_name}}`, `{{contact_name}}`,
  `{{website}}`, `{{niche}}` placeholders; they're filled in per lead.
- **Send** — one click sends the next N (default 20) untouched leads through your
  connected Gmail account, using Gmail's API so replies land in the same thread.
- **Tracking** — a background job polls Gmail every 30 minutes and marks a lead
  as `replied` the moment their thread gets a reply. The dashboard shows sent
  today, total sent, reply rate, and pending replies. No tracking pixels — this
  is reply-based tracking, so it works with zero hosting/deployment.
- **Cooldown** — a lead that hasn't replied becomes eligible again after N days
  (configurable), so you can follow up automatically instead of manually
  re-queuing.
- **Auto-send** (optional, off by default) — Settings has a toggle to fire the
  daily batch automatically at a given time instead of clicking "Send" yourself.

## One-time setup

### 1. Google Cloud OAuth client (needed to send/read Gmail on your behalf)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/), create
   (or pick) a project.
2. **APIs & Services > Library** — enable the **Gmail API**.
3. **APIs & Services > OAuth consent screen** — set it up (External is fine);
   add your own Gmail address as a test user if the app stays in "Testing" mode.
4. **APIs & Services > Credentials > Create Credentials > OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:4000/api/auth/gmail/callback`
5. Copy the generated **Client ID** and **Client Secret**.

### 2. Configure the server

```bash
cd cold-email/server
cp .env.example .env
# paste your Client ID / Client Secret into .env
npm install
npm run dev
```

The API runs on `http://localhost:4000`.

### 3. Run the dashboard

```bash
cd cold-email/client
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`). The dev server proxies
`/api` to the backend on port 4000.

### 4. Connect Gmail and go

1. **Settings** → **Connect Gmail** → sign in with whichever Gmail address you
   want cold emails sent from → approve access.
2. **Templates** → add at least one template.
3. **Leads** → add or import your brand list (CSV columns:
   `brand_name, contact_name, email, website, niche, notes`).
4. **Send** → click send. Come back to **Dashboard** any time to see sent count,
   reply rate, and per-lead status — replies are picked up automatically.

## Notes / limits

- Data is stored locally in a SQLite file at `cold-email/server/data/cold-email.db`
  (git-ignored). Back it up if it matters to you.
- Gmail imposes sending limits (much lower for cold outreach than the raw
  quota) — keep batch sizes reasonable (20–30/day) to protect deliverability.
  This is a personal-use automation tool, not a bulk mailer; respect recipients'
  right to opt out and applicable anti-spam law (e.g. CAN-SPAM/GDPR) for your
  outreach.
- `.env` and the SQLite data folder are git-ignored — never commit real
  credentials or lead data.
