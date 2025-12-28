    import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
    import { BrandService } from './brand.service';
    import { CreateBrandDto, idDto, QueryDto, updateBrandDto } from './brand.dto';
    import type { HUserDocument } from 'src/DB';
    import { TokenTypeEnum, userRole } from 'src/common';
    import { Userdecorator } from 'src/common/decorators/user.decorator';
    import { Auth } from 'src/common/decorators/auth.decorators';
    import { FileInterceptor } from '@nestjs/platform-express'; // ⬅️ IMPORT THIS
import { fileValidation, multerCloud } from 'src/common/utils';
import { Types } from 'mongoose';


    @Controller('brands')
    export class BrandController {
        constructor(private readonly brandService: BrandService) { }
// 1-----------------------Api : create brand
        @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @Post()
        //It extracts the text fields (like name and slogan) 
        // and places them into the standard Express request body (req.body), 
        // allowing your @Body() decorator to work.
        @UseInterceptors(FileInterceptor("attachment" , multerCloud({fileType: fileValidation.image})))
              //naming convention: brandDto = body = any name
        async createBrand(
            @Body() brandDto: CreateBrandDto,
            @Userdecorator() user: HUserDocument,
            @UploadedFile(ParseFilePipe) file: Express.Multer.File
        ) {
            //The local variable brand inside BrandController.createBrand() is assigned the value 
            // that was returned from BrandService.createBrand().
            const brand = await this.brandService.createBrand(brandDto, user, file)
            return { message: 'Brand created successfully', brand }
        }
// 2-----------------------Api : update brand
     @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @Patch("/update/:id")
              //naming convention: brandDto = body = any name
        async updateBrand(
            @Param() params: idDto,
            @Body() brandDto: updateBrandDto,
            @Userdecorator() user: HUserDocument,
        ) {
            //The local variable brand inside BrandController.createBrand() is assigned the value 
            // that was returned from BrandService.createBrand().
            const brand = await this.brandService.updateBrand(params.id,brandDto, user)
            return { message: 'Brand updated successfully', brand }
        }
        // 3-----------------------Api : update Image brand
        @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @UseInterceptors(FileInterceptor("attachment" , multerCloud({fileType: fileValidation.image})))
        @Patch("/update/image/:id")
        async updateBrandImage(
            @Param() params: idDto,
            @Userdecorator() user: HUserDocument,
            @UploadedFile(ParseFilePipe) file: Express.Multer.File
        ) {

            const brand = await this.brandService.updateBrandImage(params.id,file,user)
            return { message: 'Brand image updated successfully', brand }
        }
        // 4------------------------Api : freeze brand

        @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @Patch("/freeze/:id")
        async freezeBrand(
            @Param() params: idDto,
            @Userdecorator() user: HUserDocument,
            
        ) {

            const brand = await this.brandService.freezeBrand(params.id,user)
            return { message: 'Brand freeze successfully', brand }
        }
        // 5------------------------Api : restore brand
        @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @Patch("/restore/:id")
        async restoreBrand(
            @Param() params: idDto,
            @Userdecorator() user: HUserDocument,
            
        ) {

            const brand = await this.brandService.restoreBrand(params.id,user)
            return { message: 'Brand restored successfully', brand }
        }

        // 6------------------------Api : delete brand
        @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @Delete("/:id")
        async deleteBrand(
            @Param() params: idDto,
            
        ) {

            const brand = await this.brandService.deleteBrand (params.id)
            return { message: 'Brand deleted successfully', brand }
        }

        // 7------------------------Api : get All brands
        @Get()
        async getAllBrands(
            // query: QueryDto  == query: {page: number, limit: number}
            @Query() query: QueryDto
        ) {
            const brands = await this.brandService.getAllBrands(query)
            return {message:"Done All brands",brands}
        }

        // 8------------------------Api : get All brands with cashing
        @Get("/getbrandscash")
        async getAllBrandsCashing(
            // query: QueryDto  == query: {page: number, limit: number}
            @Query() query: QueryDto
        ) {
            const brands = await this.brandService.getAllBrandsCashing(query)
            return {message:"Done All brands",brands}
            
        }




    }
