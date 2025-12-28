import { Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';
import type { HUserDocument } from 'src/DB';
import { TokenTypeEnum, userRole } from 'src/common';
import { Userdecorator } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorators';
import { CartService } from './cart.service';
import { CreateCartDto, paramDto, updateQuantityDto } from './cart.dto';


@Controller('cart')
export class CartController {
    constructor(private readonly CartService: CartService) { }

    // 1-----------------------Api : create Cart
    @Post()
    @Auth({
        role: [userRole.USER , userRole.ADMIN],
        typeToken: TokenTypeEnum.access
    })
    async createCart(
        @Body() body: CreateCartDto,
        @Userdecorator() user: HUserDocument,
    ) {
        // The local variable brand inside BrandController.createBrand() is assigned the value 
        // that was returned from BrandService.createBrand().
        const cart = await this.CartService.createCart( body, user)
        return { message: 'cart is created successfully' , cart , user , body }
    }

    // 2-----------------------Api : remove product from cart
    @Delete(":id")
    @Auth({
        role: [userRole.USER , userRole.ADMIN],
        typeToken: TokenTypeEnum.access
    })
    async removeProducFromCartCst(
        @Param() param: paramDto,
        @Userdecorator() user: HUserDocument,
    ) {
     
        const cart = await this.CartService.removeProductFromCart( param.id, user)
        return { message: 'product / cart is removed successfully' , cart  }
    }
    // 3-----------------------Api : update product quantity from cart
    @Patch(":id")
    @Auth({
        role: [userRole.USER , userRole.ADMIN],
        typeToken: TokenTypeEnum.access
    })
    async updateQuantityCart(
        @Param() param: paramDto,
        @Body() body: updateQuantityDto,
        @Userdecorator() user: HUserDocument,
    ) {
     
        const cart = await this.CartService.updateQuantityFromCart( param.id, user , body)
        return { message: 'Cart is updated successfully' , cart  }
    }



}
