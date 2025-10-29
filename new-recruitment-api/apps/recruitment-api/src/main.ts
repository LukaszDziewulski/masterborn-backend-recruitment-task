import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    })
  );

  // Global prefix
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  // Setup Swagger documentation
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}/${globalPrefix}`, "Bootstrap");
  Logger.log(`Swagger documentation: http://localhost:${port}/api`, "Bootstrap");
}

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Recruitment API")
    .setVersion("1.0")
    .addTag("Candidates", "Candidate management endpoints")
    .addTag("Job Offers", "Job offer management endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}

bootstrap();
