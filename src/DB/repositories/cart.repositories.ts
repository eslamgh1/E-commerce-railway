import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Brand, Cart, HBrandDocument, HCartDocument } from "../models";


// type DBRepo<TDocument> hydrate document
@Injectable()
//export class BrandRepo extends DBRepo<Brand> // changed
export class CartRepo extends DBRepo<HCartDocument> {
  

   constructor(@InjectModel(Cart.name)protected override readonly model: Model<HCartDocument>){
        super(model)
    }






}
