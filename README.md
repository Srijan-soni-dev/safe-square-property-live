# Safe Square Property Management

Private internal dashboard (React + Vite + Tailwind + shadcn/ui + Supabase).

## Setup (Steps 1-4: auth + protected routes)

### 1. Supabase project
1. supabase.com -> New project.
2. Project Settings -> API: copy the **Project URL** and **anon public key**.
3. Authentication -> Providers -> Email: keep enabled. Turn **off** "Allow new users to sign up" (private app: only you create users).
4. Authentication -> Users -> Add user -> Create new user: enter email + password and tick **Auto Confirm User**.

### 2. Run locally
```bash
npm install
cp .env.example .env     # paste your Supabase URL + anon key
npm run dev
```
Open http://localhost:5173 and sign in with the user from step 1.4.

### 3. Build
```bash
npm run build && npm run preview
```
