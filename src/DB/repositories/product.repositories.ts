import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import {  HProductDocument, Product } from "../models";


// type DBRepo<TDocument> hydrate document
@Injectable()
//export class BrandRepo extends DBRepo<Brand> // changed
export class ProductRepo extends DBRepo<HProductDocument> {
  

   constructor(@InjectModel(Product.name)protected override readonly model: Model<HProductDocument>){
        super(model)
    }






}
