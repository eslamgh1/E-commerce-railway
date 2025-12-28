import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Review {   
    @Prop({ type: Number, required: true, min: 1, max: 5 })
    rating: number;
    // ------------------

    @Prop({ type: String, required: true,minlength: 3, maxlength: 50 })
    title: string;

    @Prop({ type: String, required: true,minlength: 3, maxlength: 500 })
    cstReview: string;

    // Modified: Single Product Reference
    @Prop({ type: Types.ObjectId, ref: "Order", required: true })
    orderId: Types.ObjectId;
    
    // // Modified: Single Product Reference
    // @Prop({ type: Types.ObjectId, ref: "Product", required: true })
    // productId: Types.ObjectId;

    @Prop({type:Types.ObjectId, ref:"Cart" ,required:true})
    cartId: Types.ObjectId;

    // used by
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    user: Types.ObjectId; 

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: Types.ObjectId;

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date
}
export type HReviewDocument = HydratedDocument<Review>;

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const ReviewModel = MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])