import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCouponDto, QueryDto } from './coupon.dto';
import { CouponRepo, HUserDocument } from 'src/DB';
import { Types } from 'mongoose';




@Injectable()
export class CouponService {
    // inject Coupon repo
    constructor(
        private readonly CouponRepo: CouponRepo,

    ) { }

    // 1-----------------------Api : create Coupon service
    async createCoupon(body: CreateCouponDto, user: HUserDocument) {
    
        const {code ,amount ,fromDate ,toDate} = body

        const couponExist = await this.CouponRepo.findOne({ 
            filter: { code: code.toLowerCase() } 
        })

        if (couponExist) {
            throw new ConflictException('Coupon already exist')
        }

        const coupon = await this.CouponRepo.create({
            code,
            amount,
            fromDate,
            toDate,
            createdBy:[user._id],
            usedBy:[],
        })

        if(!coupon){
            throw new InternalServerErrorException('Faild to create Coupon')
        }


        return coupon
    }



}


