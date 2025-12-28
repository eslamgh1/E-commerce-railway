import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BrandModel, BrandRepo, CategoryModel, CategoryRepo, ProductModel, ProductRepo, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';

@Module({
  imports:[BrandModel ,UserModel ,ProductModel,CategoryModel],
  controllers: [ProductController],
  providers: [ProductService , TokenService ,JwtService , UserRepo ,BrandRepo ,S3Service , CategoryRepo ,ProductRepo ]
})
export class ProductModule {}
