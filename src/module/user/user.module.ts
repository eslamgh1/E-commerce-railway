import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/DB/models';
import { OtpRepo, UserRepo } from 'src/DB';
import { OtpModel } from 'src/DB/models';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/service/token.services';
import { S3Service } from 'src/common/service/s3.service';

// import { AuthenticationMiddleware } from 'src/middleware';
import type {Request,Response,NextFunction} from 'express';

@Module({
  imports:[UserModel , OtpModel,
 
  ],
  controllers: [UserController],
  providers: [UserService,UserRepo,OtpRepo,JwtService,TokenService,S3Service] // service,repo
}) 

// we ignore the middleware because we use decorators
export class UserModule {
  //   configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(tokenType(),AuthenticationMiddleware)
  //     .forRoutes({
  //       path: 'users/*demo',
  //       method: RequestMethod.ALL
  //     });
  // }
}
