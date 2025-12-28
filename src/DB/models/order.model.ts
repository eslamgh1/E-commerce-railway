


import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { ref } from "process";

import slugify from "slugify";
import { orderStatusEnum, paymentMethodEnum } from "src/common/enums/order.enums";

@Schema({timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}, strictQuery:true})
export class Order {


    @Prop({type:Types.ObjectId, ref:"User" ,required:true})
    userID: Types.ObjectId;


    @Prop({type:Types.ObjectId, ref:"Cart" ,required:true})
    cart: Types.ObjectId;

    @Prop({type:Types.ObjectId, ref:"Coupon"})
    coupon: Types.ObjectId;


    @Prop({ type: Number , required:true})
    totalPrice: number;

    
    @Prop({ type: String, required: true})
    address: string;
    
    @Prop({ type: String, required: true})
    phone: string;
    
    @Prop({ type: String, enum: paymentMethodEnum, required: true})
    paymentMethod: paymentMethodEnum
    
    @Prop({ type: String, enum: orderStatusEnum, required: true})
    status: orderStatusEnum
    

   @Prop({type: Date ,default: Date.now() + 3 * 24 * 60 * 60 *1000})
   arriveAt: Date

   @Prop({type: String})
   paymentIntent: String

  @Prop({
    type: {
        paidAt: Date,
        deliveredAt: Date,
        deliveredBy: { type: Types.ObjectId, ref:"User" },
        canceledAt: Date,
        canceledBy: { type: Types.ObjectId, ref:"User" },
        refundAt: Date,
        refundBy: { type: Types.ObjectId, ref:"User" },
    }
})
  orderChanges: Object

}

export type HOrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);


export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])


