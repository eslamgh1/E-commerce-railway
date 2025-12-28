//CategoryDto is a class that is used to validate the data that body is sent to the server
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate, validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne, IdsMongo } from '../../common/decorators'; // <-- Use { } for named exports
// OR whatever the correct relative path is

export class CreateCategoryDto {
  @IsString()
  @Length(2, 255)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 25)
  @IsNotEmpty()
  slogan: string;

  @Validate(IdsMongo)
  @IsOptional()
  brands:Types.ObjectId[]

}


export class idDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}


// custom decorator to validate at least one field
// PartialType is a utility type that makes all properties of the type optional
@AtLeastOne(["name", "slogan"])
export class updateCategoryDto extends PartialType(CreateCategoryDto) {

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
