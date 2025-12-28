import { Module } from '@nestjs/common';

import {  BrandModel, BrandRepo, CategoryModel, CategoryRepo, SubCategoryModel, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryService } from './subCategory.service';
import { SubCategoryRepo } from 'src/DB/repositories/subCategory.repositories';


@Module({
  imports:[CategoryModel,BrandModel,UserModel ,SubCategoryModel],
  controllers: [SubCategoryController],
  providers: [SubCategoryService , TokenService ,JwtService , UserRepo ,CategoryRepo ,S3Service ,BrandRepo ,SubCategoryRepo]
})
export class SubCategoryModule {}
