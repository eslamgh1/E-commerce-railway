//BrandDto is a class that is used to validate the data that body is sent to the server
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { couponValidator } from "src/common/decorators/coupon.decorator";



export class CreateCouponDto {
  @IsString()
  @Length(2, 255)
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  @Validate(couponValidator)
  fromDate: Date;

  @IsDateString()
  @IsNotEmpty()
  toDate: Date;



}


export class idDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}


export class QueryDto {

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;


  }
