//BrandDto is a class that is used to validate the data that body is sent to the server
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators/brand.decorator";



export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(2, 500)
  @IsNotEmpty()
  cstReview: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: Types.ObjectId;

  // @IsMongoId()
  // @IsNotEmpty()
  // productId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  cartId: Types.ObjectId;


  @IsMongoId()
  @IsNotEmpty()
  user: Types.ObjectId;

}

export class UpdateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(2, 500)
  @IsNotEmpty()
  cstReview: string;

  @IsMongoId()
  @IsNotEmpty()
  orderId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  reviewId: Types.ObjectId;
  
  @IsMongoId()
  @IsNotEmpty()
  cartId: Types.ObjectId;


  @IsMongoId()
  @IsNotEmpty()
  user: Types.ObjectId;

}


export class idDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}


// // custom decorator to validate at least one field
// // PartialType is a utility type that makes all properties of the type optional
// @AtLeastOne(["name", "slogan"])
// export class updateBrandDto extends PartialType(CreateBrandDto) {


// }

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
