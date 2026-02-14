# Overthinkr Next.js Build Guide

## 1. Project Initialization
Run the following to scaffold the project:
```bash
npx create-next-app@latest overthinkr
# Select: Typescript, ESLint, Tailwind CSS, src/ directory (No), App Router (Yes), Import Alias (@/*)
cd overthinkr
npm install mongoose bcryptjs next-auth vader-sentiment natural react-chartjs-2 chart.js
```

## 2. Environment Setup
Create a `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/overthinkr
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

## 3. Database Connection (`lib/db.ts`)
Set up the cached MongoDB connection pattern to prevent multiple connections in dev mode.

## 4. Mongoose Models (`lib/models/`)
Create the schemas defined in the Implementation Plan.
- **User.ts**: For auth and gems.
- **Session.ts**: Stores the journal entry, hidden stress scores, and completion state.
- **Task.ts**: Stores the static or dynamic tasks (Breathing, etc).

## 5. API Routes Implementation
- **`/api/journal`**: The entry point.
  - Receives text.
  - Runs `vader-sentiment` analysis.
  - Saves a `Session` with `status: 'LOCKED'`.
- **`/api/tasks/complete`**:
  - Validates the task was actually done (server-side timestamp checks).
  - Updates the `Session`.

## 6. Frontend Pages
- **`app/journal/page.tsx`**: A clean, distraction-free text area.
- **`app/dashboard/page.tsx`**: The "Locked" view.
  - Checks session status.
  - If locked, shows "Pay X Gems" or "Complete Tasks".
  - If unlocked, renders `react-chartjs-2` Line chart comparing Initial vs Final stress.

## 7. The Core Loop Logic
1. **Input**: User types "I'm stressed about the deadline."
2. **Analysis**: backend detects 'stressed', 'deadline'. Score: 85/100.
3. **Lock**: FE receives `{ status: 'LOCKED', message: 'Insight ready. Cost: 50 gems' }`.
4. **Action**: User clicks "Breathe (60s)". Timer runs.
5. **Reward**: Task done. Gems += 20.
6. **Unlock**: User spends gems.
7. **Reveal**: Backend calculates difference. "You went from 85 to 60. Good job."

## 8. Styling
Use Tailwind for the "Premium" feel:
- Dark mode by default (`bg-slate-900`).
- Glassmorphism (`bg-white/10 backdrop-blur-md`).
- Gradients for emotions (Red/Orange for stress, Blue/Green for calm).
