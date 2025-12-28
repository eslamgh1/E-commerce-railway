import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Brand, HBrandDocument } from "../models";


// type DBRepo<TDocument> hydrate document
@Injectable()
//export class BrandRepo extends DBRepo<Brand> // changed
export class BrandRepo extends DBRepo<HBrandDocument> {
  

   constructor(@InjectModel(Brand.name)protected override readonly model: Model<HBrandDocument>){
        super(model)
    }






}
