import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateReviewDto, idDto, QueryDto, UpdateReviewDto } from './review.dto';
import type { HUserDocument } from 'src/DB';
import { TokenTypeEnum, userRole } from 'src/common';
import { Userdecorator } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express'; // ⬅️ IMPORT THIS
import { fileValidation, multerCloud } from 'src/common/utils';
import { Types } from 'mongoose';
import { ReviewService } from './review.service';


@Controller('reviews')
export class ReviewController {
    constructor(private readonly ReviewService: ReviewService) { }
    // 1-----------------------Api : create Review
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Post()
    //It extracts the text fields (like name and slogan) 
    // and places them into the standard Express request body (req.body), 
    // allowing your @Body() decorator to work.

    //naming convention: ReviewDto = body = any name
    async createReview(
        @Body() ReviewDto: CreateReviewDto,
        @Userdecorator() user: HUserDocument,

    ) {
        //The local variable Review inside ReviewController.createReview() is assigned the value 
        // that was returned from ReviewService.createReview().
        const Review = await this.ReviewService.createReview(ReviewDto, user)
        return { message: 'Review created successfully', Review }
    }

    // 2-----------------------Api : update review

    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Patch("/update")
    //naming convention: ReviewDto = body = any name
    async updateReview(
        @Body() ReviewDto: UpdateReviewDto,
        @Userdecorator() user: HUserDocument,
    ) {
        //The local variable Review inside ReviewController.createReview() is assigned the value 
        // that was returned from ReviewService.createReview().
        const Review = await this.ReviewService.updateReview(ReviewDto, user)
        return { message: 'Review updated successfully', Review }
    }

    // 3--------------------------Api : delete review
    @Auth({
        role: [userRole.USER],
        typeToken: TokenTypeEnum.access
    })
    @Delete()
    //naming convention: ReviewDto = body = any name
    async deleteReview(
        @Body() ReviewDto: idDto,
        @Userdecorator() user: HUserDocument,
    ) {
        const Review = await this.ReviewService.deleteReview(ReviewDto.id, user)
        return { message: 'Review deleted successfully', Review }
    }




}
