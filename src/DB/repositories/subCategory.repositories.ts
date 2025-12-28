import { DBRepo } from "./db.repositories";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { HSubCategoryDocument, SubCategory } from "../models";


@Injectable()

export class SubCategoryRepo extends DBRepo<HSubCategoryDocument> {
  
   constructor(@InjectModel(SubCategory.name)protected override readonly model: Model<HSubCategoryDocument>){
        super(model)
    }

}
