import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto, QueryDto, UpdateReviewDto } from './review.dto';
import { CartRepo, HUserDocument, OrderRepo, ReviewRepo } from 'src/DB';
import { orderStatusEnum, S3Service } from 'src/common';
import { Types } from 'mongoose';


@Injectable()
export class ReviewService {
    // inject Review repo
    constructor(
        private readonly ReviewRepo: ReviewRepo,
        private readonly S3Service: S3Service,
        private readonly cartRepo: CartRepo,
        private readonly orderRepo: OrderRepo
        // @Inject(CACHE_MANAGER) private cacheManager: Cache

    ) { }

    // 1-----------------------Api : create Review service
    async createReview(ReviewDto: CreateReviewDto, user: HUserDocument) {
        const { rating, title, cstReview, orderId, cartId } = ReviewDto
        // check order
        const order = await this.orderRepo.findOne({
            filter: {
                _id: orderId,
                userID: user._id,

            },
            options: {
                populate: [
                    {
                        path: "cart",  // Populate cart doesn't work
                        populate: [{
                            path: "products.productId" // Populate cart items and their product details
                        }]
                    }
                ]
            }
        });
        console.log({ order })

        if (!order) {
            throw new ConflictException('order not found')
        }

        // create review
        const review = await this.ReviewRepo.create({
            rating,
            title,
            cstReview,
            orderId,
            cartId,
            user: user._id
        })

        return review

    }
    // 2-----------------------Api : update Review service
    async updateReview(updateReviewDto: UpdateReviewDto, user: HUserDocument) {
        const { rating, title, cstReview, reviewId } = updateReviewDto

        const existingReview = await this.ReviewRepo.findOne({
            filter: { 
                _id: reviewId,
                user: user._id
            } 
        }); 

        if (!existingReview) {
            throw new NotFoundException(`Order with ID ${reviewId} not found or not eligible for review.`);
        }


        // update review
        const updatedReview = await this.ReviewRepo.findOneAndUpdate({
            filter: {
                _id: reviewId,
                user: user._id
            },
            update: { rating, title, cstReview },
            options: { new: true }
        })

        return updatedReview

    }
    // 3-----------------------Api : Delete Review service
  
    async deleteReview(reviewId: Types.ObjectId, user: HUserDocument) {
        
        const existingReview = await this.ReviewRepo.findOne({
            filter: { 
                _id: reviewId,
                user: user._id
            } 
        }); 

        if (!existingReview) {
            throw new NotFoundException(`Review with ID ${reviewId} not found or not eligible for review.`);
        }


        // delete review
        const deletedReview = await this.ReviewRepo.findOneAndDelete({
            filter: {
                _id: reviewId,
                user: user._id
            }
        })

        return deletedReview
    }


}


