import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Coupon, HCouponDocument } from "../models";


// type DBRepo<TDocument> hydrate document
@Injectable()
export class CouponRepo extends DBRepo<HCouponDocument> {

   constructor(@InjectModel(Coupon.name) protected override readonly model: Model<HCouponDocument>){
        super(model)
    }


}
