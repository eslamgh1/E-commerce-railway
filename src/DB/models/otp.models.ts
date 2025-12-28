import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { eventEmitter, otpTypeEnum } from "src/common";
import { Hash } from "src/common/security/hash";


@Schema({ timestamps: true })
export class Otp {
    @Prop({ required: true, type: String, trim: true })
    code: string

    @Prop({ required: true, type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId

    @Prop({ required: true, type: String, enum: otpTypeEnum })
    type: otpTypeEnum

    @Prop({ required: true, type: Date })
    expiresAt: Date

}

export type HOtpDocument = HydratedDocument<Otp>;
export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
//this: Type    ====> HOtpDocument & {is_new:boolean , plainCode:string}
OtpSchema.pre("save", async function (this: HOtpDocument & { is_new: boolean, plainCode: string }, next) {
    // console.log(this)
    if (this.isModified("code")) {
        //===
        this.plainCode = this.code
        this.is_new = this.isNew
        //===hash the code
        // console.log("Before hash:", this.code);
        this.code = await Hash({ plainText: this.code })
        // console.log("After hash:", this.code);

        await this.populate([
            {
                path: "createdBy",
                select: "email",
            }
        ])
    }
    next()
})



// doc.type == otpTypeEnum.CONFIRM_EMAIL/FORGET_PASSWORD
OtpSchema.post("save", function (doc, next) {
    const that = this as HOtpDocument & { is_new: boolean, plainCode: string }
    if (that.is_new) {
        eventEmitter.emit(doc.type, {
            otp: that.plainCode,
            email: (doc.createdBy as any).email
        })
    }
    next()
    // console.log(doc)
  
})

export const OtpModel = MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])