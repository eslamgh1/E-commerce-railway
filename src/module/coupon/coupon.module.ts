import { Module } from '@nestjs/common';
import {  couponController } from './coupon.controller';
import {  CouponService } from './coupon.service';
import { BrandModel, BrandRepo, CouponModel, CouponRepo, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';

@Module({
  imports:[BrandModel ,UserModel , CouponModel],
  controllers: [couponController],
  providers: [CouponService , TokenService ,JwtService , UserRepo ,BrandRepo ,S3Service ,CouponRepo ]
})
export class CouponModule {}
