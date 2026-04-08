# Zyntiq Admin Panel (Phase 2)

React admin UI for:

- Admin login
- Intern list with pagination and search
- Add/Edit intern modal
- Delete intern
- User landing page with popup search
- Certificate results page
- Certificate detail page
- Verification result page

## Setup

```bash
cd client
npm install
cp .env.example .env
```

Default API:

`VITE_API_BASE_URL=http://localhost:5000/api`

## Run

```bash
npm run dev
```

## Pages

- `/` User landing page
- `/certificates` User certificate list page
- `/certificate/:certificateId` User certificate detail page
- `/verify/:certificateId` User verification page
- `/admin/login` Admin login
- `/admin` Protected admin dashboard
