# Airbnb Clone

Monorepo: Next.js frontend + FastAPI backend. UI modeled after Airbnb; payments mocked; seed data uses Indian locations and INR pricing.

## Setup

### Prerequisites

- Node.js 20+
- Python 3.11+ (3.9+ may work for local dev)

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## Tech stack

<!-- Frontend, backend, tooling -->

## Architecture

<!-- Monorepo layout, api/queries/constants conventions, FastAPI layers -->

## Database schema

<!-- Tables and relationships (TBD) -->

## API overview

<!-- /api/v1 routes, pagination and error shapes -->

## Assumptions

<!-- Domain choices, mocked payments, INR, etc. -->
