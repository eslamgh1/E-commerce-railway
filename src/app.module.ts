import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { S3Service } from './common';
import { BrandModule } from './module/brand/brand.module';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';
import { CouponModule } from './module/coupon/coupon.module';
import { SubCategoryModule } from './module/subcategory/subCategory.module';
import { OrderModule } from './module/order/order.module';
import { GatewayModule } from './module/gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ReviewModule } from './module/review/review.module';

// Both AppModule and AppController now use the same class referenc

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: './config/.env',
    isGlobal: true
  }), 
// cashing
  CacheModule.register({
  isGlobal: true,
  ttl:5000
}),

  MongooseModule.forRoot(process.env.DB_URL_LOCAL as string , {
    
  onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log(`Mongo DB connected successfully ${process.env.DB_URL_LOCAL}`));  
    connection.on('disconnected', () => console.log(`Mongo DB disconnected successfully ${process.env.DB_URL_LOCAL}`));

    return connection;
  }
  }),
  GatewayModule,
  UserModule,
  BrandModule,
  CategoryModule,
  ProductModule,
  CartModule,
  CouponModule,
  SubCategoryModule,
  OrderModule,
  ReviewModule


  ],

  controllers: [AppController],
  providers: [AppService , S3Service],
})
export class AppModule { 

}