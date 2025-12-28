import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class    CartProduct {

    @Prop({ type: Types.ObjectId, ref: "Product", required: true })
    productId: Types.ObjectId;

    @Prop({ type: Number, required: true })
    quantity: number

    @Prop({ type: Number, required: true })
    finalPrice: number

}


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, strictQuery: true })
export class Cart {

    @Prop({ type: [CartProduct] })
    products: CartProduct[]

    @Prop({ type: Types.ObjectId, ref: "User" })
    createdBy: Types.ObjectId;

    @Prop({ type: Number })
    subTotal: number

    @Prop({ type: Date })
    deletedAt: Date

    @Prop({ type: Date })
    restoredAt: Date
}

export type HCartDocument = HydratedDocument<Cart>;

export const cartSchema = SchemaFactory.createForClass(Cart);


// Note we are going to use save in update as below hook
cartSchema.pre("save", async function (next) {
    this.subTotal = this.products.reduce((total, product) => total + (product.quantity * product.finalPrice), 0)   
    next()
})

// Note we are going to use Paranoid in find as below hook
cartSchema.pre(["findOne", "find", "findOneAndUpdate"], async function (next) {
    const { paranoid, ...rest } = this.getQuery()
    if (paranoid === false) {
        //deletedAt = true which means deleted
        this.setQuery({ ...rest, deletedAt: { $exists: true } })
    } else {
        //deletedAt = false which means not deleted
        this.setQuery({ ...rest, deletedAt: { $exists: false } })
    }
    next()

})


export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }])


