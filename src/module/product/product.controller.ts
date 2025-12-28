import { Body, Controller,Param,ParseFilePipe, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import type { HUserDocument } from 'src/DB';
import { TokenTypeEnum, userRole } from 'src/common';
import { Userdecorator } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; // ⬅️ IMPORT THIS
import { fileValidation, multerCloud } from 'src/common/utils';
import { ProductService } from './product.service';
import { CreateProductDto, paramDto, updateProductDto } from './product.dto';

@Controller('Products')
export class ProductController {
    constructor(private readonly ProductService: ProductService) { }

    // 1-----------------------Api : create Product

    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    //It extracts the text fields (like name and slogan) 
    // and places them into the standard Express request body (req.body), 
    // allowing your @Body() decorator to work.
    @UseInterceptors(FileFieldsInterceptor(
        [{ 
            name: "mainImage", 
            maxCount: 1 
        },
        {
            name: "subImages", 
            maxCount: 5 
        }],
        multerCloud({ fileType: fileValidation.image })))
    //naming convention: brandDto = body = any name
    @Post()
    async createProduct(
        @Body() productDto: CreateProductDto,
        @Userdecorator() user: HUserDocument,
        @UploadedFiles(ParseFilePipe) files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }
    ) {
        //The local variable brand inside BrandController.createBrand() is assigned the value 
        // that was returned from BrandService.createBrand().
        const product = await this.ProductService.createProduct(productDto, user,files)
        return { message: 'Product is created successfully', product }
    }

    // 2-----------------------Api : update Product
    @Put(":id")
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    async updateProduct(
        @Param() param:paramDto,
        @Body() body: updateProductDto,
        @Userdecorator() user: HUserDocument,
    ) {

        const product = await this.ProductService.updateProduct(body, user , param.id)
        return { message: 'Product is updated successfully', product }
    }


    //3-----------------------Api : add to wish list

    @Post("wishlist/:id")
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    async addToWishList(
        @Param() param:paramDto,
        @Userdecorator() user: HUserDocument,
    ) {

        const userExist = await this.ProductService.addToWishListProduct(  user , param.id)
        return { message: 'Product is  added to wish list successfully', userExist }
    }






}

