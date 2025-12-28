import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { userGender, userProvider, userRole } from "src/common/enums";
import type { HOtpDocument } from "./otp.models";
import { Hash } from "src/common/security/hash";

//toJSON:{virtuals:true}  to to get response
//toObject:{virtuals:true} to to get console.log()
//strictQuery:true to prevent query injection

@Schema({timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}, strictQuery:true})
export class User {
    @Prop({type:String,required:true,trim:true,minlength:3,maxlength:100})
    fName: string;
    @Prop({type:String,required:true,trim:true,minlength:3,maxlength:100})
    lName: string;

    @Virtual({
        get(){
        return `${this.fName} ${this.lName}`;
    },

        set(v: string){
        this.fName = v.split(" ")[0];
        this.lName = v.split(" ")[1];
    }
    })
    

    userName: string;

    @Prop({type:String,required:true,unique:true,trim:true,minlength:3,maxlength:100 ,lowercase:true})
    email: string;

    @Prop({type:String,required:true,trim:true})
    password: string;

    @Prop({type:Number, required:true , minLength:15 , maxLength:90})
    age: number;

    @Prop({type:Boolean})
    confirmed:boolean; // it doesn't take default value in order to make it """not required"""

    @Prop({type:String, enum:userRole, default:userRole.USER})
    role: userRole;
    @Prop({type:String, enum:userGender, default:userGender.MALE})
    gender: userGender;
    @Prop({type:String, enum:userProvider, default:userProvider.LOCAL})
    provider: userProvider;
    @Prop({type:Date, default:Date.now})
    changecredentailAt: Date;

    @Virtual()
    otp?:HOtpDocument

    //wishList part
    @Prop({type:[{type:Types.ObjectId, ref:"Product"}]})
    wishList?:Types.ObjectId[]
}

export type HUserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await Hash({plainText: this.password})
    }
    next()
})
UserSchema.virtual("otp" ,{
    ref:"Otp",
    localField:"_id",
    foreignField:"createdBy"
})

export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
