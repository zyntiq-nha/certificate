# Zyntiq Certificate Backend (Phase 1)

Express + MongoDB Atlas backend for:

- Admin login (JWT)
- Intern CRUD (with pagination + search)
- Certificate lookup (Name + Email)
- Certificate details by certificateId
- Verification endpoint
- PDF certificate generation with embedded QR code

## 1. Setup

```bash
cd server
npm install
cp .env.example .env
```

Update `.env` values:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (optional)
- `PUBLIC_BASE_URL` (optional, backend base URL for API verification links)
- `FRONTEND_BASE_URL` (optional, recommended; QR points to frontend `/verify/:certificateId`)
- `CORS_ORIGINS` (comma-separated allowed frontend origins)
- `RATE_LIMIT_MAX` (max requests per IP per minute)

## 2. Create Admin

```bash
npm run create:admin -- admin@zyntiq.com strongpassword123  Admin@12345
```

## 3. Run

```bash
npm run dev
```

Health check:

```bash
GET /health
```

## 4. API Summary

### Admin

- `POST /api/admin/login`

Body:

```json
{
  "email": "admin@zyntiq.com",
  "password": "strongpassword123"
}
```

### Interns (Admin JWT required)

- `GET /api/interns?page=1&limit=10&search=rahul`
- `POST /api/interns`
- `PUT /api/interns/:id`
- `DELETE /api/interns/:id`

`POST/PUT` body example:

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@email.com",
  "certificates": ["ta_1", "ex", "ca"]
}
```

### User certificate routes

- `POST /api/certificates/find`
- `GET /api/certificate/:certificateId`
- `GET /api/certificate/generate/:certificateId` (returns generated PDF)
- `GET /api/verify/:certificateId`

Find body:

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@email.com"
}
```

## 5. Hardening Added

- Request size limit: `200kb`
- Basic security headers
- Per-IP rate limiting (`RATE_LIMIT_MAX` per minute)
- Validation for email, intern id, and certificate id
- Regex-safe search input escaping
