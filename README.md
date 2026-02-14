# 🧠 Overthinkr

### A Gamified Emotional Reflection Web App (Next.js + Node.js + MongoDB)

Overthinkr is a gamified web-based emotional reflection system that analyzes daily journal entries using sentiment analysis and behavioral scoring. Users complete short micro-interventions before unlocking their stress insights through comparative analytics.

---

## 🌟 Core Idea

Instead of instantly showing stress analysis, Overthinkr encourages users to perform short, psychologically helpful tasks (breathing exercises, reframing thoughts, movement, etc.) to “earn” access to their emotional dashboard. The app then compares stress levels *before and after* the tasks, showing users how small actions can reduce mental load.

---

## 🔄 Full User Flow

1. **Journal Entry** – Users write freely about their day; backend calculates stress score.
2. **Locked Insight Screen** – Users spend gems or complete tasks to unlock insights.
3. **Mini Task System** – Gamified micro-tasks with timer validation and gem rewards.
4. **Post-Task Reassessment** – Stress score recalculated after tasks.
5. **Dashboard Reveal** – Visual comparison of before/after stress scores.
6. **Witty Insight + Advice** – Personalized, motivational feedback.
7. **Progress Tracking** – Optional weekly trends, calm streaks, stress word frequency.

---

## 🛠 Technology Stack

### Frontend (Next.js)
- Next.js (React framework)
- React components and pages
- TailwindCSS / CSS Modules
- Chart.js for stress comparison graphs

### Backend
- Node.js + Express (API routes)
- MongoDB + Mongoose (Database)
- bcrypt (Password hashing)
- express-session (Session management)
- dotenv (Environment variables)

### NLP / Sentiment Analysis
- VADER
- natural (NLP tokenizer & sentiment)
- Compromise (optional keyword extraction)

### Tools / Dev
- Nodemon for live reload
- VS Code (recommended)
- Postman / Insomnia (API testing)

---

## ✨ Features
- Daily journaling with emotional reflection
- Automated sentiment & stress scoring
- Mini-task system with gamified gem rewards
- Timer-based task validation
- Post-task stress reassessment
- Dashboard with before/after graphs
- Personalized insights and motivational tips
- User history and session tracking

---

## 💻 Installation




git clone https://github.com/lidafrancis/Overthinkr.git
cd Overthinkr

1️⃣ System Requirements

Node.js (v18+ recommended) – Runtime for backend and Next.js frontend.
npm (comes with Node.js) – Package manager for installing dependencies.
MongoDB – Database for storing users, journal entries, tasks, gems, and sessions
Antigravity - code editor

2️⃣ Node.js Packages (Installed via npm install)
Core Backend Dependencies
Package	       Purpose
express	    Backend server to handle API routes
mongoose    Connect to MongoDB and define models

Frontend / Next.js Dependencies
Package	        Purpose
next	        Next.js framework (React-based SSR / SSG)

NLP / Sentiment Analysis
Package	Purpose
vader-sentiment	Pretrained sentiment scoring (compound score)

3️⃣ Install MongoDB Server

To install the actual database server:
winget install MongoDB.MongoDBServer

This downloads and installs MongoDB locally.
By default, MongoDB will install as a Windows service, so it can start automatically.

4️⃣ How to Install Everything
# 1. Navigate to project folder
cd overthinkr

# 2. Install all dependencies
npm install

# 3. If you use Tailwind
npx tailwindcss init -p

# 4. Start MongoDB (local)
mongod

# 5. Start development server
npm run dev

SUMMARIZE: To run Overthinkr locally, you must have Node.js + npm + MongoDB installed, plus the npm packages listed above. Dev tools like nodemon make development easier, and NLP packages (vader-sentiment) are required for stress scoring.
