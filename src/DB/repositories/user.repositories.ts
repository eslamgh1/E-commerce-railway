import { DBRepo } from "./db.repositories";
import { HUserDocument, User } from "../models/user.models";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";


// type DBRepo<TDocument> hydrate document
@Injectable()
export class UserRepo extends DBRepo<HUserDocument> {
    // constructor(protected override readonly model: Model<HUserDocument>){
    //     super(model)
    // }

   constructor(@InjectModel(User.name) protected override readonly model: Model<HUserDocument>){
        super(model)
    }






}
