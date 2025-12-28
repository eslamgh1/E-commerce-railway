    import { Body, Controller, Post } from '@nestjs/common';
    import { CouponService } from './coupon.service';
    import { CreateCouponDto, idDto, QueryDto } from './coupon.dto';
    import type { HUserDocument } from 'src/DB';
    import { TokenTypeEnum, userRole } from 'src/common';
    import { Userdecorator } from 'src/common/decorators/user.decorator';
    import { Auth } from 'src/common/decorators/auth.decorators';

    @Controller('coupon')
    export class couponController {
        constructor(private readonly couponService: CouponService) { }
// 1-----------------------Api : create coupon
        @Auth({
            role: [userRole.USER],
            typeToken: TokenTypeEnum.access
        })
        @Post()

        async createCoupon(
            @Body() couponDto: CreateCouponDto,
            @Userdecorator() user: HUserDocument,
 
        ) {

            const coupon = await this.couponService.createCoupon(couponDto ,user)
            return { message: 'coupon created successfully', coupon }
        }



    }
