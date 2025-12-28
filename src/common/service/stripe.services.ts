import { Injectable } from "@nestjs/common";
import Stripe from 'stripe';

@Injectable()
export class StripeServices {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    constructor() { }
    createCheckOutSession = async (
        {
            line_items,
            discounts,
            metadata,
            customer_email
        }: {
            line_items: [],
            discounts?: Stripe.Checkout.SessionCreateParams.Discount[],
            customer_email: string,
            metadata: {}
        }
    ) => {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email,
            metadata,
            success_url: 'http://localhost:3000/order/success',
            cancel_url: 'http://localhost:3000/order/cancel',
            line_items,
            discounts,

        });
        return session;
    }


    createCoupon = async (
        {
            percent_off,
    
        }: {
            percent_off: number,

        }
    ) => {
        const coupon = await this.stripe.coupons.create({
            percent_off,
            duration: "once"

        });
        return coupon;
    }


    createRefundPayment = async (
        {
            payment_intent
        }: {
        
            payment_intent: any
        }
    ) => {
        const refund = await this.stripe.refunds.create({
            payment_intent,
            reason:"requested_by_customer"

        });
        return refund;
    }

}

