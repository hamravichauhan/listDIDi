# Listening Korner

A calm, warm, and responsive website for **Rekha Devi Chauhan**, Counselling Psychologist & Behavioural Therapist.

Built with React 19, TypeScript, Vite, and Tailwind CSS.

---

## Features

- **Personal Profile**: Bio, credentials, therapeutic philosophy, and photo for Rekha Devi Chauhan.
- **Session Offerings & Transparent Pricing**: Clear breakdown for India (₹800/₹1000) and International clients (₹1000/₹1500).
- **Streamlined Intake Form**:
  - Personal details (Name, Age, Location, WhatsApp, Email).
  - Who the session is for (Myself vs. Someone else).
  - Optional issue description in client's own words.
  - Follow-up timing preferences (Morning, Afternoon, Late Afternoon, Evening) & preferred days.
  - Direct 1-click WhatsApp confirmation on submission.
- **Admin Portal (`#admin`)**: Lightweight management view for enquiries, pricing, bio, and FAQs.

---

## Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Run Vite dev server
pnpm dev

# 3. Build for production
pnpm build
```

---

## Deploy Live 100% Free

### Option A: Vercel (1-Click)
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** → Select `listDIDi`.
3. Framework Preset: **Vite**.
4. Click **Deploy**. Your site will be live instantly with a free `*.vercel.app` URL and SSL!

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com) and click **Import from Git**.
2. Select repository `hamravichauhan/listDIDi`.
3. Build command: `pnpm run build`, Publish directory: `dist`.
4. Click **Deploy site**.
