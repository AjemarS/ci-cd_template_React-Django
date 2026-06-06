# Django + React CI/CD Template

A full-stack template that auto-deploys to **GitHub Pages** (frontend) and **Render.com** (backend) on every push to `main`.

```
┌─────────────────────────────────────────────────────┐
│  git push origin main                               │
│         │                                           │
│    GitHub Actions                                   │
│    ┌────┴────────────────────┐                      │
│    ▼                         ▼                      │
│  Build React             Trigger Render             │
│  npm run build           deploy hook                │
│    │                         │                      │
│    ▼                         ▼                      │
│  GitHub Pages            Render.com                 │
│  (frontend)              (Django backend)           │
└─────────────────────────────────────────────────────┘
```

**Live result:** open `https://<your-username>.github.io/<repo-name>/` — click the button — it calls your Django API and shows the response.

---

## Repository structure

```
my-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml          CI/CD pipeline
├── frontend/                   React (Vite) app
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             calls GET /api/hello/
│       ├── App.css
│       └── index.css
├── backend/                    Django project
│   ├── manage.py
│   ├── requirements.txt
│   ├── core/                   Django project package
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/                    Django app with endpoints
│       ├── views.py
│       └── urls.py
├── render.yaml                 Render Blueprint (auto-creates the service)
└── README.md
```

---

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/hello/` | Returns `{"message": "Hello, World!", "status": "ok"}` |
| `GET` | `/api/health/` | Health check used by Render — returns `{"status": "healthy"}` |

---

## One-time setup (do this before your first push)

### 1 — Fork or clone this repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2 — Enable GitHub Pages

1. GitHub repo → **Settings** → **Pages**
2. Source → **GitHub Actions**
3. Save

### 3 — Create the Render service

1. [render.com](https://render.com) → sign in → **New → Blueprint**
2. Connect this repository
3. Render reads `render.yaml` and creates the Django service automatically
4. Wait for the first build to finish
5. Copy your service URL: `https://my-backend.onrender.com`

> **Manual setup (skip Blueprint):**
> New → Web Service → connect repo → Root Directory: `backend`
> Build: `pip install -r requirements.txt`
> Start: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`

### 4 — Get the Render Deploy Hook URL

Render dashboard → your service → **Settings** → **Deploy Hook** → copy the URL

### 5 — Add GitHub secret and variable

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**

**Secret** (hidden in logs):

| Name | Value |
|------|-------|
| `RENDER_DEPLOY_HOOK_URL` | The deploy hook URL from step 4 |

**Variable** (visible in logs):

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://my-backend.onrender.com` |

### 6 — Set Render environment variables

Render dashboard → your service → **Environment** → add these:

| Key | Value | Notes |
|-----|-------|-------|
| `SECRET_KEY` | a long random string | generate at [djecrety.ir](https://djecrety.ir) |
| `ALLOWED_HOSTS` | `my-backend.onrender.com` | your Render subdomain |
| `CORS_ALLOWED_ORIGINS` | `https://your-username.github.io` | your GitHub Pages origin |

### 7 — Push and watch it deploy

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Go to **Actions** tab — you'll see both jobs running in parallel. When both go green ✅, your app is live.

---

## Local development

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the dev server
python manage.py runserver
# → http://localhost:8000/api/hello/
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create a local env file so the app points to your local Django server
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Start the dev server
npm run dev
# → http://localhost:5173
```

Both servers must run at the same time for the frontend button to work locally.

---

## How the CI/CD pipeline works

The workflow (`.github/workflows/deploy.yml`) runs on every push to `main` and has two parallel jobs:

### Job 1 — deploy-frontend

1. Checks out the repo
2. Installs Node dependencies (`npm ci`)
3. Builds the React app (`npm run build`) — `VITE_API_URL` is injected at this step so the built bundle knows the backend URL
4. Uploads the `frontend/dist` folder as a GitHub Pages artifact
5. Deploys it to GitHub Pages

### Job 2 — deploy-backend

1. Sends an HTTP POST to the Render Deploy Hook URL
2. Render receives the signal, pulls the latest `backend/` code, and redeploys
3. The job only runs when files inside `backend/` changed (or when triggered manually), saving unnecessary deploys

> **Manual trigger:** go to Actions → Deploy Frontend & Backend → **Run workflow** to deploy both regardless of what changed.

---

## Customising this template

### Add a new API endpoint

1. Add a view in `backend/api/views.py`
2. Register the URL in `backend/api/urls.py`
3. Call it from `frontend/src/App.jsx` using `${API_BASE}/api/your-endpoint/`

### Add a database (PostgreSQL on Render)

1. Render dashboard → **New → PostgreSQL** → create a database
2. Copy the **Internal Database URL**
3. Add it as an environment variable in your service: `DATABASE_URL`
4. Install `psycopg2-binary` and add to `requirements.txt`
5. Update `DATABASES` in `backend/core/settings.py`:

```python
import dj_database_url
DATABASES = {"default": dj_database_url.config(env="DATABASE_URL")}
```

### Use React Router (client-side routing)

GitHub Pages returns 404 for unknown paths. Add a `404.html` redirect workaround:

1. Copy `frontend/index.html` → `frontend/public/404.html`
2. Add this script to the `<head>` of `404.html`: see [spa-github-pages](https://github.com/rafgraph/spa-github-pages) for the full snippet

---

## Free tier notes

| Service | Limit | Effect |
|---------|-------|--------|
| GitHub Pages | 1 GB storage, 100 GB/month bandwidth | Plenty for most projects |
| Render free web service | Spins down after 15 min idle | First request after sleep takes 30–60 s |

To avoid the cold-start delay, use a free uptime monitor (e.g. [UptimeRobot](https://uptimerobot.com)) to ping `/api/health/` every 10 minutes.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Backend | Django 5, Gunicorn |
| CORS | django-cors-headers |
| Frontend hosting | GitHub Pages |
| Backend hosting | Render.com (free tier) |
| CI/CD | GitHub Actions |