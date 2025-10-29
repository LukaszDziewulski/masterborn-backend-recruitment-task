# Recruitment API

Modern recruitment management system built with **NestJS**, **Nx**, **Prisma**, and **PostgreSQL**.

## 📋 Features

- **Candidate Management**: Create and manage candidates with full recruitment lifecycle
- **Job Offer Integration**: Associate candidates with multiple job offers
- **Legacy System Sync**: Automatic synchronization with legacy recruitment API
- **Pagination**: Efficient handling of large candidate datasets (up to 1000+ per position)
- **REST API**: Well-documented REST API with Swagger/OpenAPI
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Comprehensive unit and e2e tests
- **Docker Ready**: Containerized application and database

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd new-recruitment-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Start database with Docker**

```bash
npm run db:dev:up
```

4. **Run database migrations**

```bash
npm run prisma:migrate:deploy
```

5. **Generate Prisma Client**

```bash
npm run prisma:generate
```

6. **Start the application**

```bash
npm run start:dev
```

The API will be available at:

- **Application**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api

## 📦 Available Scripts

### Development

- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugger
- `npm run build` - Build production bundle
- `npm run start` - Start production server

### Database

- `npm run db:dev:up` - Start development database
- `npm run db:dev:rm` - Remove development database
- `npm run db:dev:restart` - Restart database and run migrations
- `npm run prisma:migrate:dev` - Create and apply new migration
- `npm run prisma:migrate:deploy` - Apply pending migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run prisma:generate` - Generate Prisma Client

### Testing

- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run e2e tests

### Code Quality

- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🏗️ Project Structure

```
new-recruitment-api/
├── apps/
│   └── recruitment-api/          # Main NestJS application
│       ├── src/
│       │   ├── main.ts           # Application entry point
│       │   └── app/              # App module, controller, service
│       └── test/                 # E2E tests
├── libs/
│   └── api/
│       ├── db/                   # Prisma database module (will be created)
│       ├── candidate/            # Candidate feature module (will be created)
│       ├── job-offer/            # Job offer feature module (will be created)
│       └── common/               # Shared utilities (will be created)
├── prisma/
│   ├── schema.prisma             # Database schema (will be created)
│   └── migrations/               # Database migrations
├── docker-compose.yml            # Docker configuration (will be created)
├── Dockerfile                    # Application container (will be created)
├── .env                          # Environment variables
└── nx.json                       # Nx workspace configuration
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Candidate**: Stores candidate information with recruitment status
- **JobOffer**: Available job positions
- **CandidateJobOffer**: Many-to-many relation between candidates and job offers
- **Recruiter**: HR recruiters information

## 📚 API Documentation

Once the application is running, visit:

- **Swagger UI**: http://localhost:3000/api

### Main Endpoints (Will be implemented)

- `POST /api/candidates` - Create new candidate
- `GET /api/candidates` - List candidates with pagination
- `GET /api/candidates/:id` - Get candidate by ID
- `GET /api/job-offers` - List available job offers

## 🔧 Configuration

Environment variables are configured in `.env` file:

```env
DATABASE_URL=postgresql://recruitment_user:recruitment123@localhost:5436/recruitment_db?schema=public
PORT=3000
NODE_ENV=development
LEGACY_API_URL=http://localhost:4040
LEGACY_API_KEY=0194ec39-4437-7c7f-b720-7cd7b2c8d7f4
```

## 🐳 Docker

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

## 🧪 Testing

The project includes:

- **Unit Tests**: For services, controllers, and utilities
- **Integration Tests**: For repository and database operations
- **E2E Tests**: For complete API workflows

Run all tests:

```bash
npm run test
```

## 🏗️ Architecture

This project follows best practices:

- **Monorepo Structure**: Nx workspace for scalable architecture
- **Modular Design**: Feature-based modules (libs)
- **Repository Pattern**: Separation of data access logic
- **DTO Validation**: Class-validator for request validation
- **Swagger Documentation**: Auto-generated API docs
- **Environment Configuration**: Type-safe configuration management
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 📝 Next Steps

This is the initial project setup. The following features will be implemented:

1. ✅ Project initialization with Nx and NestJS
2. ⏳ Prisma setup with PostgreSQL
3. ⏳ Docker configuration
4. ⏳ Candidate module implementation
5. ⏳ Job offer module implementation
6. ⏳ Legacy API integration
7. ⏳ Comprehensive testing
8. ⏳ Production deployment

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Run linter: `npm run lint`
5. Commit with conventional commits
6. Create a pull request

## 📄 License

ISC

## 👥 Author

MasterBorn
