


import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";

import slugify from "slugify";

@Schema({timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}, strictQuery:true})
export class SubCategory {

    @Prop({type:String,required:true,trim:true,minlength:3,maxlength:100, unique:true})
    name: string;

    @Prop({type:String,required:true,trim:true,minlength:3,maxlength:50})
    slogan: string;


    @Prop({type:String,default: function(){ return slugify(this.name , {replacement: "-" ,lower:true , trim:true})}})
    slug: string;

    @Prop({type:String,required:true})
    image: string;

    @Prop({type:String})
    assetFolderId:string;

    // Relationship: Parent Child

    // supports populate
    @Prop({type:[{type:Types.ObjectId, ref:"Brand"}]})
    brands: Types.ObjectId[]

    @Prop({type:[{type:Types.ObjectId, ref:"Category"}]})
    categories: Types.ObjectId[]

    @Prop({type:Types.ObjectId, ref:"User"})
    createdBy: Types.ObjectId;

    @Prop({type:Types.ObjectId, ref:"User"})
    updatedBy: Types.ObjectId;

    @Prop({type:Date})
    deletedAt: Date

   @Prop({type: Date})
   restoredAt: Date
}

export type HSubCategoryDocument = HydratedDocument<SubCategory>;

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

SubCategorySchema.pre(["updateOne" ,"findOneAndUpdate"], async function (next) {
    const update = this.getUpdate() as UpdateQuery<SubCategory>
 
    if(update.name){
        update.slug = slugify(update.name , {replacement: "-" ,lower:true , trim:true})
    }

    next()  
})

SubCategorySchema.pre(["findOne" ,"find" ,"findOneAndUpdate"], async function(next){
    const {paranoid , ...rest} = this.getQuery()
    if(paranoid === false){
        //deletedAt = true which means deleted
    this.setQuery({...rest , deletedAt:{$exists:true}})
    }else{
        //deletedAt = false which means not deleted
        this.setQuery({...rest , deletedAt:{$exists:false}})
    }
    next()
    
}) // <--- Ensure the closing parenthesis is here!


export const SubCategoryModel = MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }])


