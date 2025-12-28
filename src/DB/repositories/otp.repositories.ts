import { DBRepo } from "./db.repositories";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { HOtpDocument, Otp } from "../models";


@Injectable()
export class OtpRepo extends DBRepo<HOtpDocument> {


   constructor(@InjectModel(Otp.name) protected override readonly model: Model<HOtpDocument>){
        super(model)
    }






}
