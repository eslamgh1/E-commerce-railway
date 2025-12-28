


import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";

import slugify from "slugify";

@Schema({timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}, strictQuery:true})
export class Category {

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

    @Prop({type:Types.ObjectId, ref:"User"})
    createdBy: Types.ObjectId;

    @Prop({type:Types.ObjectId, ref:"User"})
    updatedBy: Types.ObjectId;

    @Prop({type:Date})
    deletedAt: Date

   @Prop({type: Date})
   restoredAt: Date
}

export type HCategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre(["updateOne" ,"findOneAndUpdate"], async function (next) {
    const update = this.getUpdate() as UpdateQuery<Category>
 
    if(update.name){
        update.slug = slugify(update.name , {replacement: "-" ,lower:true , trim:true})
    }

    next()  
})

CategorySchema.pre(["findOne" ,"find" ,"findOneAndUpdate"], async function(next){
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


export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])


