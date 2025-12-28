import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateCategoryDto, idDto, QueryDto, updateCategoryDto } from './category.dto';
import type { HUserDocument } from 'src/DB';
import { TokenTypeEnum, userRole } from 'src/common';
import { Userdecorator } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express'; // ⬅️ IMPORT THIS
import { fileValidation, multerCloud } from 'src/common/utils';
import { Types } from 'mongoose';
import { CategoryService } from './category.service';


@Controller('categories')
export class categoryController {
    constructor(private readonly categoryService: CategoryService) { }
    // 1-----------------------Api : create category
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Post()
    //It extracts the text fields (like name and slogan) 
    // and places them into the standard Express request body (req.body), 
    // allowing your @Body() decorator to work.
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileType: fileValidation.image })))
    //naming convention: categoryDto = body = any name
    async createcategory(
        @Body() categoryDto: CreateCategoryDto,
        @Userdecorator() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {
        //The local variable category inside categoryController.createcategory() is assigned the value 
        // that was returned from categoryService.createcategory().
        const category = await this.categoryService.createCategory(categoryDto, user, file)
        return { message: 'category created successfully', category }
    }
    // 2-----------------------Api : update category
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Patch("/update/:id")
    //naming convention: categoryDto = body = any name
    async updatecategory(
        @Param() params: idDto,
        @Body() categoryDto: updateCategoryDto,
        @Userdecorator() user: HUserDocument,
    ) {
        //The local variable category inside categoryController.createcategory() is assigned the value 
        // that was returned from categoryService.createcategory().
        const category = await this.categoryService.updateCategory(params.id, categoryDto, user)
        return { message: 'category updated successfully', category }
    }
    // 3-----------------------Api : update Image category
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @UseInterceptors(FileInterceptor("attachment", multerCloud({ fileType: fileValidation.image })))
    @Patch("/update/image/:id")
    async updatecategoryImage(
        @Param() params: idDto,
        @Userdecorator() user: HUserDocument,
        @UploadedFile(ParseFilePipe) file: Express.Multer.File
    ) {

        const category = await this.categoryService.updateCategoryImage(params.id, file, user)
        return { message: 'category image updated successfully', category }
    }
    // 4------------------------Api : freeze category

    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Patch("/freeze/:id")
    async freezecategory(
        @Param() params: idDto,
        @Userdecorator() user: HUserDocument,

    ) {

        const category = await this.categoryService.freezeCategory(params.id, user)
        return { message: 'category freeze successfully', category }
    }
    // 5------------------------Api : restore category
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Patch("/restore/:id")
    async restorecategory(
        @Param() params: idDto,
        @Userdecorator() user: HUserDocument,

    ) {

        const category = await this.categoryService.restoreCategory(params.id, user)
        return { message: 'category restored successfully', category }
    }

    // 6------------------------Api : delete category
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Delete("/:id")
    async deletecategory(
        @Param() params: idDto,

    ) {

        const category = await this.categoryService.deleteCategory(params.id)
        return { message: 'category deleted successfully', category }
    }

    // 7------------------------Api : get All categorys
    @Get()
    async getAllcategorys(
        // query: QueryDto  == query: {page: number, limit: number}
        @Query() query: QueryDto
    ) {
        const categoryes = await this.categoryService.getAllCategorys(query)
        return { message: "Done All categorys", categoryes }
    }




}
