import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'New Project: High-Performance E-commerce Backend with NestJS & TypeScript- Deployment: Successfully deployed the application on Railway';
  }
}
