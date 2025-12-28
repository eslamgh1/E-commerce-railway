import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import {  OrderService } from './order.service';
import { BrandModel, BrandRepo, CartRepo, CouponModel, CouponRepo, OrderRepo, ProductModel, ProductRepo, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';
import { OrderModel } from 'src/DB/models/order.model';
import { CartModel } from 'src/DB/models/cart.model';
import { CouponService } from '../coupon/coupon.service';
import { StripeServices } from 'src/common/service/stripe.services';


@Module({
  imports:[  UserModel , OrderModel , CartModel , CouponModel, ProductModel],
  controllers: [OrderController],
  providers: [OrderService , TokenService ,JwtService , UserRepo ,S3Service ,OrderRepo ,CartRepo , CouponRepo , ProductRepo , CouponService, StripeServices]
})
export class OrderModule {}


