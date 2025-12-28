import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { HReviewDocument, Review } from "../models/review.model";


// type DBRepo<TDocument> hydrate document
@Injectable()
//export class BrandRepo extends DBRepo<Brand> // changed
export class ReviewRepo extends DBRepo<HReviewDocument> {
  
   constructor(@InjectModel(Review.name)protected override readonly model: Model<HReviewDocument>){
        super(model)
    }

}


