


import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";



@Schema({timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}, strictQuery:true})
export class Coupon {

    @Prop({type:String,required:true,minlength:3,maxlength:100, unique:true , trim:true, lowercase:true})
    code: string;

    @Prop({type:Number , required:true })
    amount: number

    @Prop({type:Date , required:true})
    fromDate: Date;

    @Prop({type:Date , required:true})
    toDate: Date;


    @Prop({type:[{type:Types.ObjectId, ref:"User"}]})
    createdBy: Types.ObjectId[];

    @Prop({type:[{type:Types.ObjectId, ref:"User"}]})
    usedBy: Types.ObjectId[];

    @Prop({type:Date})
    deletedAt: Date

   @Prop({type: Date})
   restoredAt: Date
}

export type HCouponDocument = HydratedDocument<Coupon>;

export const CouponSchema = SchemaFactory.createForClass(Coupon);



CouponSchema.pre(["findOne" ,"find" ,"findOneAndUpdate"], async function(next){
    const {paranoid , ...rest} = this.getQuery()
    if(paranoid === false){
        //deletedAt = true which means deleted
    this.setQuery({...rest , deletedAt:{$exists:true}})
    }else{
        //deletedAt = false which means not deleted
        this.setQuery({...rest , deletedAt:{$exists:false}})
    }
    next()
    
}) // <--- Ensure the closing parenthesis is here!


export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])


