import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your E-commerce frontend
  app.enableCors();

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Recommended: transforms payloads to match DTO types
    }),
  );

  // Railway dynamically assigns a port
  const port = process.env.PORT || 3000;
  
  // Binding to 0.0.0.0 is critical for cloud deployments
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on port: ${port}`);
}
bootstrap();