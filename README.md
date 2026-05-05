# 🌱 Replate

> Connecting mess kitchens with NGOs to eliminate food waste — through intelligent priority-based matching.

## Live Demo Features

### Mess Dashboard (`/mess`)
- Report surplus food in 3 clicks (category → quantity → time window)
- Auto priority matching modal shows top-ranked NGO with score breakdown
- Active listings with urgency bars and claim status

### NGO Dashboard (`/ngo`)
- Real-time incoming request feed with urgency timers
- Claim / Pass buttons — claiming locks the request
- Priority ranking sidebar (5 NGOs scored live)
- Factor weight breakdown (distance 30%, urgency 25%, availability 20%, fairness 15%, reliability 10%)
- Live notification log

### Priority Scoring Engine (`lib/data.ts → computePriorityScore`)
```
Score = 0.30×DistanceScore + 0.25×UrgencyScore + 0.20×AvailabilityScore + 0.15×FairnessScore + 0.10×ReliabilityScore
```

---

## 🚀 Deploy to Vercel (Free — 5 min)

### Step 1 — Push to GitHub
```bash
cd Replate
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/Replate.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your `Replate` repo
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy** — done in ~60 seconds ✅

Your live URL: `https://Replate.vercel.app`

---

## 🗄️ Adding a Real Database (Supabase — Free)

1. Create free project at [supabase.com](https://supabase.com)
2. Run this SQL in Supabase SQL Editor:

```sql
create table listings (
  id uuid default gen_random_uuid() primary key,
  mess_id text not null,
  mess_name text not null,
  category text not null,
  quantity text,
  unit text,
  prep_time text,
  pickup_from text,
  pickup_to text,
  notes text,
  status text default 'pending',
  claimed_by text,
  urgency_pct integer default 50,
  posted_at timestamptz default now()
);

create table ngos (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  distance_km numeric,
  is_active boolean default true,
  reliability_score integer default 80,
  last_assigned timestamptz
);
```

3. Add `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Install: `npm install @supabase/supabase-js`
5. Replace demo data in `lib/data.ts` with Supabase queries

---

## 📁 Project Structure

```
Replate/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Redirects to /mess
│   ├── globals.css         # Dark theme + base styles
│   ├── mess/
│   │   └── page.tsx        # Mess Dashboard
│   ├── ngo/
│   │   └── page.tsx        # NGO Dashboard
│   └── api/
│       ├── listings/route.ts   # GET/POST listings
│       └── claim/route.ts      # POST claim a listing
├── components/
│   ├── Navbar.tsx          # Shared navigation
│   ├── MatchModal.tsx      # Priority match popup
│   └── ui.tsx              # Badge, StatCard, etc.
└── lib/
    └── data.ts             # Types, demo data, scoring engine
```

---

## 🔭 Roadmap

- [ ] SMS notifications via Twilio / MSG91 for NGOs without smartphones
- [ ] Real-time updates with Supabase Realtime subscriptions
- [ ] NGO registration flow
- [ ] Mess staff login (NextAuth)
- [ ] Auto-fallback: expand notification radius after 8 min timeout
- [ ] Analytics dashboard — meals saved over time
- [ ] Mobile PWA for field use
