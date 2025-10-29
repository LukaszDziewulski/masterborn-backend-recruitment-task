# api-db

This library provides database access through Prisma ORM.

## Features

- **PrismaService**: Main service for database operations
- **PrismaModule**: Global module exported to entire application
- **Database utilities**: Clean DB, seed data functions

## Usage

The PrismaModule is automatically available globally. Simply inject PrismaService:

```typescript
import { PrismaService } from "@recruitment-api/db";

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
```

## Running unit tests

Run `nx test api-db` to execute the unit tests via [Jest](https://jestjs.io).
