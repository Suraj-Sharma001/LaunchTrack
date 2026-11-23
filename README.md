# LaunchTrack ✳

A personal internship and job-application workspace built with **Next.js (React), Express, MongoDB, Mongoose, Recharts, and Lucide**.

![Architecture](https://img.shields.io/badge/Next.js-15-black) ![API](https://img.shields.io/badge/Express-4-purple) ![Database](https://img.shields.io/badge/MongoDB-Mongoose-green)

## Features

- Beautiful responsive dashboard: applications tracked, active leads, interviews, offers, six-month trend graph, status doughnut chart.
- Full CRUD: add, edit, delete, search, filter, and sort applications.
- Track company, role, link, date applied, deadline, work mode, location, source, contact, compensation, priority, notes, follow-up date, and **exact resume version**.
- Kanban-style pipeline (Wishlist → Applied → OA → Interview → Offer).
- Status-change history stored in MongoDB (backend).
- Resume library: upload PDF / DOCX (max 8 MB), download, set default, delete, and track count of applications using each version.
- Optional sample data for a polished dashboard the first time you open the app.
- Mobile responsive, empty states, errors, confirmation dialogs.

## Requirements

- Node.js 20.9+ (22 LTS recommended)
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Run locally (Windows PowerShell or terminal)

From the **root** of the extracted project:

```bash
npm install
npm run install:all
```

Create env files by copying the provided examples:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

On Linux/macOS:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

If you use MongoDB Atlas, update `MONGO_URI` in `backend/.env` with your own connection string. Never commit `.env`.

Ensure MongoDB is running, then optionally load **sample records**:

```bash
npm run seed
```

Start both servers:

```bash
npm run dev
```

Visit **http://localhost:3000** (API at **http://localhost:5000/api**).

> If you don't seed, the dashboard starts empty and all new records are yours. `npm run seed` never overwrites existing applications.

## Project structure

```
launchtrack/
├── frontend/
│   └── src/
│       ├── app/            # Next.js app, responsive dashboard and styles
│       └── lib/api.js      # API client
├── backend/
│   └── src/
│       ├── models/         # Application and Resume MongoDB models
│       ├── routes/         # REST endpoints
│       ├── seed.js         # Optional demo data
│       └── index.js        # Express server
├── backend/uploads/        # Locally stored resume PDFs / DOCXs
└── package.json            # Run API and web together
```

## API endpoints

| Method | Endpoint | Function |
| --- | --- | --- |
| GET | `/api/health` | health check |
| GET | `/api/applications` | list/search applications |
| POST | `/api/applications` | create application |
| PATCH | `/api/applications/:id` | update application |
| DELETE | `/api/applications/:id` | delete application |
| GET | `/api/analytics` | dashboard metrics |
| GET | `/api/resumes` | list resume versions with usage counts |
| POST | `/api/resumes` | upload PDF/DOCX as multipart form-data (`file`, `name`, `description`) |
| GET | `/api/resumes/:id/download` | download resume |
| PATCH | `/api/resumes/:id/default` | make a resume the default |
| DELETE | `/api/resumes/:id` | delete resume and clear references |

## Important notes

- **Local-first / single-user app**: no login, accounts, or permissions in this edition. It's intended for personal use on your computer. **Do not deploy it publicly without adding authentication, authorization, request throttling, and secure file storage.**
- Resume files are stored in `backend/uploads/`; metadata and associations are stored in MongoDB. Back up both.
- Uploaded files are limited by extension and size; production deployments should additionally validate file signatures and perform malware scanning.
- Demo seed includes a **placeholder** resume without an actual PDF file; upload your real resume in Resume Library and assign it to your applications.
- Data is persisted in MongoDB. Charts update from actual stored records; no hardcoded dashboard metrics.
