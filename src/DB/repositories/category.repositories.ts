import { DBRepo } from "./db.repositories";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Category, HCategoryDocument } from "../models";

@Injectable()

export class CategoryRepo extends DBRepo<HCategoryDocument> {
  
   constructor(@InjectModel(Category.name)protected override readonly model: Model<HCategoryDocument>){
        super(model)
    }


}
