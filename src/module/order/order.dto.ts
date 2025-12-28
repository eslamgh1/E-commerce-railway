//BrandDto is a class that is used to validate the data that body is sent to the server
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { paymentMethodEnum } from "src/common";
import { AtLeastOne } from "src/common/decorators/brand.decorator";


@AtLeastOne(["phone", "address"])
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(paymentMethodEnum)
  paymentMethod: paymentMethodEnum;

  @IsString()
  @IsOptional()
  couponCode?: string;


}


export class idDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsNotEmpty()
  id: Types.ObjectId;
}


// custom decorator to validate at least one field
// PartialType is a utility type that makes all properties of the type optional
// @AtLeastOne(["phone", "address"])
// export class updateOrderDto extends PartialType(CreateOrderDto) {


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
