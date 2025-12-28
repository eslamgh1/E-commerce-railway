import { Module } from '@nestjs/common';

import {  ReviewService } from './review.service';
import { BrandModel, BrandRepo, CartModel, CartRepo, OrderRepo, ReviewModel, ReviewRepo, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';
import { ReviewController } from './review.controller';
import { OrderModel } from 'src/DB/models/order.model';

@Module({
  imports:[UserModel,ReviewModel,OrderModel, CartModel],
  controllers: [ReviewController],
  providers: [ReviewService , TokenService ,JwtService , UserRepo  ,S3Service,ReviewRepo ,CartRepo , OrderRepo]
})
export class ReviewModule {}
