# 🚴 Cycle Tracker

A track cycling training log built with React. Log sessions, track personal records, and visualize progress over time.

**Live Demo:** [https://nstapc.github.io/cycle-tracker](https://nstapc.github.io/cycle-tracker)

> The app runs with demo data out of the box. Connect your own NocoDB instance to persist real training data.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Charts | Recharts |
| Backend / API | [NocoDB](https://nocodb.com/) (self-hosted) |
| Database | PostgreSQL (via Railway) |
| Hosting | GitHub Pages (static deploy) |

## Features

- **Session Log** — Log training sessions with type, duration, distance, power, and heart rate
- **PR Tracker** — View personal records per exercise (Flying 200m, Standing Start, etc.)
- **Progress Charts** — Line, area, and bar charts with rolling-average trend lines
- **Demo Mode** — Falls back to sample data when NocoDB is not configured

## Getting Started

```bash
git clone https://github.com/nstapc/cycle-tracker.git
cd cycle-tracker
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default. Without NocoDB configured it loads demo data automatically.

## NocoDB Setup

The app expects three tables in a NocoDB instance. See `.env.example` for the required environment variables.

### 1. Create a NocoDB instance

The quickest way is [Railway](https://railway.app) — deploy the NocoDB template with a Postgres addon. Note your instance URL.

### 2. Create the tables

In the NocoDB UI, create a new base (project) and add three tables:

**sessions**
| Column | Type |
|--------|------|
| date | Date |
| type | SingleSelect: `Sprint`, `Interval`, `Endurance`, `Recovery`, `Track`, `Strength` |
| duration | Number (minutes) |
| distance | Number (km) |
| avg_power | Number (watts) |
| avg_hr | Number (bpm) |
| notes | LongText |

**exercises**
| Column | Type |
|--------|------|
| name | Text |
| category | SingleSelect: `Sprint`, `Endurance`, `Strength` |
| description | LongText |

**efforts**
| Column | Type |
|--------|------|
| session_id | LinkToAnotherRecord → sessions |
| exercise_id | LinkToAnotherRecord → exercises |
| set_number | Number |
| max_power | Number (watts) |
| avg_power | Number (watts) |
| time | Number (seconds) |
| distance | Number (meters) |
| notes | Text |

### 3. Get your IDs and token

- **Base ID** and **Table IDs** — visible in the NocoDB URL bar when viewing a table, e.g. `/dashboard/#/nc/pq0abc123xyz/mt4ndef567ghi` → base ID is `pq0abc123xyz`, table ID is `mt4ndef567ghi`
- **API Token** — go to Account Settings → Tokens in NocoDB and create one

### 4. Configure environment

```bash
cp .env.example .env.local
```

Fill in the values:

```
VITE_NOCODB_URL=https://your-instance.railway.app
VITE_NOCODB_API_TOKEN=your-api-token
VITE_NOCODB_BASE_ID=your-base-id
VITE_NOCODB_SESSIONS_TABLE_ID=your-sessions-table-id
VITE_NOCODB_EXERCISES_TABLE_ID=your-exercises-table-id
VITE_NOCODB_EFFORTS_TABLE_ID=your-efforts-table-id
```

Restart the dev server after changing `.env.local`.

## Deployment

Pushes to `master` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds the app and deploys to GitHub Pages via `actions/deploy-pages`.

To deploy manually:

```bash
npm run build
# then serve ./dist or push to master to trigger CI
```

## Project Structure

```
src/
├── api/
│   └── nocodb.js          # Centralized NocoDB API layer
├── components/
│   ├── WorkoutLog.jsx      # Session list and add-session form
│   ├── PRTracker.jsx       # Personal records view
│   └── ProgressChart.jsx   # Recharts-powered progress charts
├── App.jsx                 # Root component, data loading, tab navigation
├── App.css
├── index.css
└── main.jsx
```

## License

MIT
