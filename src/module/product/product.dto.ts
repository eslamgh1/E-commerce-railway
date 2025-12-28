//BrandDto is a class that is used to validate the data that body is sent to the server
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators/brand.decorator";
import { partial } from "zod/mini";


export class CreateProductDto {
  @IsString()
  @Length(2, 255)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  discount: number

  @IsMongoId()
  @IsNotEmpty()
  brand: Types.ObjectId

  @IsMongoId()
  @IsNotEmpty()
  category: Types.ObjectId

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  quantity: number

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  stock: number

  // @IsMongoId()
  // @IsNotEmpty()
  // subCategory: Types.ObjectId
}






@AtLeastOne(['name', 'description', 'price', 'discount', 'brand', 'category', 'quantity', 'stock'])
export class updateProductDto  extends PartialType(CreateProductDto){

}


export class paramDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}
