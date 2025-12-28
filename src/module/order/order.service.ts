
import { BadGatewayException, ConflictException, Injectable } from '@nestjs/common';
import { HUserDocument, Product, ProductRepo } from 'src/DB';
import { OrderRepo } from 'src/DB/repositories/order.repositories';
import { CartRepo } from 'src/DB/repositories/cart.repositories';
import { CouponRepo } from 'src/DB/repositories/coupon.repositories';
import { CreateOrderDto } from './order.dto';
import { orderStatusEnum, paymentMethodEnum } from 'src/common';
import { Types } from 'mongoose';
import { StripeServices } from 'src/common/service/stripe.services';

@Injectable()
export class OrderService {
    // inject order repo
    constructor(
        private readonly orderRepo: OrderRepo,
        private readonly cartRepo: CartRepo,
        private readonly couponRepo: CouponRepo,
        private readonly productRepo: ProductRepo,
        private readonly stripService: StripeServices

    ) { }

    // 1-----------------------Api :  create Order
    async createOrder(body: CreateOrderDto, user: HUserDocument) {

        const { phone, address, paymentMethod, couponCode } = body
        // check coupon
        let coupon: any
        if (couponCode) {
            coupon = await this.couponRepo.findOne({
                filter: {
                    code: couponCode,
                    usedBy: { $ne: user._id }
                },
            })

            if (!coupon) {
                throw new ConflictException('Coupon not found')
            }
        }

        // check cart
        const cart = await this.cartRepo.findOne({ filter: { createdBy: user._id } })
        if (!cart || !cart.products.length) {
            throw new ConflictException('Cart not found')
        }

        // check product stock
        for (const product of cart.products) {
            const productData = await this.productRepo.findOne({
                filter: {
                    _id: product.productId,
                    stock: { $gte: product.quantity }
                }
            })
            if (!productData) {
                throw new ConflictException('Product not found')
            }
        }

        // create order & Apply coupon in the order
        const order = await this.orderRepo.create({
            userID: user._id,
            cart: cart._id,
            coupon: couponCode ? coupon._id : undefined,
            totalPrice: couponCode ? cart.subTotal - (cart.subTotal * coupon.amount / 100) : cart.subTotal,
            address,
            phone,
            paymentMethod,
            status: paymentMethod == paymentMethodEnum.cash ? orderStatusEnum.placed : orderStatusEnum.pending,
        })

        // update product stock in product model
        for (const product of cart.products) {
            await this.productRepo.findOneAndUpdate({
                filter: {
                    _id: product.productId,
                },
                update: {
                    $inc: { stock: -product.quantity }
                },
                options: {
                    new: true
                }
            })


        }
        // update coupon usedBy in coupon model
        if (coupon) {
            await this.couponRepo.findOneAndUpdate({
                filter: { _id: coupon._id },
                update: {
                    $push: { usedBy: user._id }
                },
                options: {
                    new: true
                }
            })
        }
        // update status in cart model based payment method then remove it if payment method is cash
        if (paymentMethod == paymentMethodEnum.cash) {
            await this.cartRepo.findOneAndUpdate({
                filter: {
                    _id: cart._id
                },
                update: {
                    $set: {
                        products: []
                    }
                },
                options: {
                    new: true
                }
            })
        }


        return order



    }

    // 2-----------------------Api :  payment visa with stripe    
    async paymentWithStrip(id: Types.ObjectId, user: HUserDocument) {
        // check order
        const order = await this.orderRepo.findOne({
            filter: {
                _id: id,
                status: orderStatusEnum.pending
            },
            options: {
                populate: [
                    {
                        path: "cart",
                        populate: [{
                            path: "products.productId" // get product model
                        }
                        ]
                    },

                    {
                        path: "coupon",
                    }
                ]
            }
        })

          console.log({order})
        if (!order || !order.cart["products"].length) {
            throw new ConflictException('order not found')
        }

        // console.log({order})

        // check coupon exists
        let coupon: any

        if (order.coupon) {
            coupon = await this.stripService.createCoupon({
                percent_off: (order.coupon as any)?.amount,
            })
            // console.log(coupon)
        }

        //         let coupon: any;
        // const couponAmount = (order.coupon as any)?.amount; // Safely retrieve the amount

        // // ✅ FIX: Only call Stripe if the discount amount is positive
        // if (order.coupon && typeof couponAmount === 'number' && couponAmount > 0) {
        //     coupon = await this.stripService.createCoupon({
        //         percent_off: couponAmount,
        //     });
        // }


        // check out session section
        const { url } = await this.stripService.createCheckOutSession({
            customer_email: user.email,
            metadata: {
                orderId: order._id.toString(),
            },
            line_items: order.cart["products"].map((product: any) => ({
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: product.productId.name,
                    },
                    unit_amount: Math.round(product.finalPrice * 100),
                },
                quantity: product.quantity,
            })),

            discounts: coupon ? [{ coupon: coupon.id }] : []
        })


        return { url }
    }

    // 3-----------------------Api : webhook
    async webhook(body: any) {
        const orderId = body.data.object.metadata.orderId

        const order = await this.orderRepo.findOneAndUpdate({
            filter: {
                _id: orderId
            },
            update: {
                status: orderStatusEnum.paid,
                orderChanges: {
                    paidAt: Date.now(),
                },
                paymentIntent: body.data.object.payment_intent
            },
            // ✅ FIX: Add the required 'options' object
            options: {}
        })


        return { order };
    }


    // 4-----------------------Api : refund
    async refundedOrder(id: Types.ObjectId, user: HUserDocument) {
        let order = await this.orderRepo.findOneAndUpdate({
            filter: {
                _id: id,
                status: { $in: [orderStatusEnum.pending, orderStatusEnum.placed] }
            },
            update: {
                status: orderStatusEnum.canceled,
                orderChanges: {
                    canceledAt: Date.now(),
                    canceledBy: user._id
                },
            },
            options: {
                new: true
            }
        })

        if (!order) {
            throw new BadGatewayException("order not found")
        }

        if (order.paymentMethod == paymentMethodEnum.visa)
            await this.stripService.createRefundPayment({
                payment_intent: order.paymentIntent
            })

           order= await this.orderRepo.findOneAndUpdate({
                filter: {
                _id: id,
            },
            update: {
                status: orderStatusEnum.refunded,
                orderChanges: {
                    canceledAt: Date.now(),
                    refundBy: user._id
                },
            },
            options: {
                new: true
            }
            })

            return order

    }














}

