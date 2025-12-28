


import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";

import slugify from "slugify";
import { number } from "zod";

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Product {

    @Prop({ type: String, required: true, trim: true, minlength: 3, maxlength: 500 })
    name: string;



    @Prop({ type: String, default: function () { return slugify(this.name, { replacement: "-", lower: true, trim: true }) } })
    slug: string;

    @Prop({ type: String, required: true, trim: true, minlength: 3, maxlength: 100 })
    description: string;


    @Prop({ type: String, required: true })
    mainImage: string;

    @Prop({ type: [String] })
    subImages: string[];

    @Prop({ required: true, type: number })
    price: number;

    @Prop({ type: Number, min: 1, max: 100 })
    discount: number;

    @Prop({ type: Types.ObjectId, ref: "Brand" })
    brand: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Category" })
    category: Types.ObjectId;

    @Prop({ type: Number, min: 1, max: 100 })
    quantity: number;

    @Prop({ type: Number })
    stock: number;


    // @Prop({ type: Types.ObjectId, ref: "SubCategory" })
    // subCategory: Types.ObjectId;


    @Prop({type:number})
    rateNum: number;

    @Prop({type:number})
    rateAvg: number;

    @Prop({ type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: Types.ObjectId;

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date
}

export type HProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);

// fisrt hook for update
ProductSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
    const update = this.getUpdate() as UpdateQuery<Product>

    if (update.name) {
        update.slug = slugify(update.name, { replacement: "-", lower: true, trim: true })
    }

    next()
})

//second hook for find
ProductSchema.pre(["findOne", "find", "findOneAndUpdate"], async function (next) {
    const { paranoid, ...rest } = this.getQuery()
    if (paranoid === false) {
        //deletedAt = true which means deleted
        this.setQuery({ ...rest, deletedAt: { $exists: true } })
    } else {
        //deletedAt = false which means not deleted
        this.setQuery({ ...rest, deletedAt: { $exists: false } })
    }
    next()

}) // <--- Ensure the closing parenthesis is here!


export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])


