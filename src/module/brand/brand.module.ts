import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandModel, BrandRepo, UserModel, UserRepo } from 'src/DB';
import { TokenService } from 'src/common/service/token.services';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common';

@Module({
  imports:[BrandModel ,UserModel],
  controllers: [BrandController],
  providers: [BrandService , TokenService ,JwtService , UserRepo ,BrandRepo ,S3Service ]
})
export class BrandModule {}
