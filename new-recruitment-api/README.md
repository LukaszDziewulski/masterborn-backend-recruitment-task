# New Recruitment API

Modern recruitment management system built with NestJS, Nx, Prisma, and PostgreSQL.

## Features

- Candidate Management (full CRUD)
- Job Offer Management (link candidates to positions)
- Pagination for 1000+ candidates (max 100 per page)
- Automatic Legacy API synchronization
- 72 unit tests (100% passing)
- Swagger/OpenAPI documentation
- Docker containerization

## Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop
- npm

### Setup

```
npm install
npm run db:dev:up
npm run prisma:migrate:deploy
npm run prisma:generate
npm run start:dev
```

**URLs:**
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api

## Commands

### Development
```
npm run start:dev        # Start dev server
npm run build            # Build production
npm run start            # Start production
```

### Database
```
npm run db:dev:up        # Start PostgreSQL (Docker)
npm run db:dev:down      # Stop database
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:generate  # Generate Prisma Client
```

### Testing
```
npm run test             # All tests
npx nx test api-candidate    # Candidate tests (44)
npx nx test api-job-offer    # Job offer tests (28)
```

### Docker
```
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

## API Endpoints

### Candidates
- POST /api/candidates - Create (auto-syncs to Legacy API)
- GET /api/candidates?page=1&limit=10 - List with pagination
- GET /api/candidates/:id - Get details
- PATCH /api/candidates/:id - Update
- DELETE /api/candidates/:id - Delete

### Job Offers
- POST /api/job-offers - Create
- GET /api/job-offers - List all
- GET /api/job-offers/:id - Get details
- PATCH /api/job-offers/:id - Update
- DELETE /api/job-offers/:id - Delete

## Testing Legacy API Sync

```
# Terminal 1: Start Legacy API
cd ../legacy-api
npm start

# Terminal 2: Create candidate via Swagger or curl
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan@example.com",
    "phone": "+48 123 456 789",
    "yearsOfExperience": 5,
    "consentDate": "2024-01-15T10:00:00Z",
    "jobOfferId": 1
  }'
```

## Configuration

.env file:
```
DATABASE_URL=postgresql://recruitment_user:recruitment123@localhost:5436/recruitment_db
PORT=3000
LEGACY_API_URL=http://localhost:4040
LEGACY_API_KEY=0194ec39-4437-7c7f-b720-7cd7b2c8d7f4
```
