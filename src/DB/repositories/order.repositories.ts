import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { HOrderDocument, Order } from "../models/order.model";


// type DBRepo<TDocument> hydrate document
@Injectable()
//export class BrandRepo extends DBRepo<Brand> // changed
export class OrderRepo extends DBRepo<HOrderDocument> {
  

   constructor(@InjectModel(Order.name)protected override readonly model: Model<HOrderDocument>){
        super(model)
    }






}
