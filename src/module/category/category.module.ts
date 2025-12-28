import { Module } from '@nestjs/common';

import {  BrandModel, BrandRepo, CategoryModel, CategoryRepo, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';
import { categoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports:[CategoryModel,BrandModel,UserModel],
  controllers: [categoryController],
  providers: [CategoryService , TokenService ,JwtService , UserRepo ,CategoryRepo ,S3Service ,BrandRepo]
})
export class CategoryModule {}
