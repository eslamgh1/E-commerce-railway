import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, updateProductDto } from './product.dto';
import { CategoryRepo, ProductRepo } from 'src/DB';
import { BrandRepo } from 'src/DB/repositories/brand.repositories';
import { S3Service } from 'src/common';
import type { HUserDocument } from 'src/DB';
import { UserRepo } from 'src/DB/repositories/user.repositories';

import { Types } from 'mongoose';


@Injectable()
export class ProductService {
    // inject brand repo
    constructor(
        private readonly ProductRepo: ProductRepo,
        private readonly categoryRepo: CategoryRepo,
        private readonly brandRepo: BrandRepo,
        private readonly s3Service: S3Service,
        private readonly UserRepo: UserRepo

    ) { }

    // 1-----------------------Api : create product service
    async createProduct(
        productDto: CreateProductDto,
        user: HUserDocument,
        files: { mainImage: Express.Multer.File[], subImages: Express.Multer.File[] }
    ) {

        let { name, description, price, discount, brand, category, quantity, stock } = productDto

        const brandExist = await this.brandRepo.findOne({ filter: { _id: brand } })

        if (!brandExist) {
            throw new ConflictException('brand not found')
        }

        const categoryExist = await this.categoryRepo.findOne({ filter: { _id: category } })

        if (!categoryExist) {
            throw new ConflictException('category not found')
        }

        if (stock < quantity) {
            throw new BadRequestException('stock is less than quantity')
        }

        price = price - (price * ((discount || 0) / 100))

        const filePath = files.mainImage[0]
        const filesPath = files.subImages

        const mainImage = await this.s3Service.uploadFile({
            file: filePath,
            path: `categories/${categoryExist.assetFolderId}/products/mainImage`
        })


        const subImages = await this.s3Service.uploadFiles({
            files: filesPath,
            path: `categories/${categoryExist.assetFolderId}/products/subImages`
        })

        const product = await this.ProductRepo.create({
            name,
            description,
            price,
            discount,
            brand,   // video 24 ==> 5:10 mins // Types.ObjectId.CreateFromHexString(brand.toString())
            category,// video 24 ==> 5:10 mins // Types.ObjectId.CreateFromHexString(category.toString())
            quantity,
            stock,
            mainImage,
            subImages,
            createdBy: user._id
        })

        if (!product) {
            await this.s3Service.deleteFile({
                Key: mainImage
            })
            await this.s3Service.deleteFiles({
                urls: subImages
            })
            throw new InternalServerErrorException('Faild to create product')
        }

        return product
    }

    // 2-----------------------Api : update product service
    async updateProduct(
        body: updateProductDto,
        user: HUserDocument,
        id:Types.ObjectId, // = paramDto
    ) {

        let { name, description, price, discount, brand, category, quantity, stock } = body

       let product = await this.ProductRepo.findOne({filter:{_id:id}})
       if(!product){
        throw new BadRequestException("Product not found")
       }

        if (category) {
            const categoryExist = await this.categoryRepo.findOne({ filter: { _id: category } })
            if (!categoryExist) {
                throw new BadRequestException('category not found')
            }
        }

        if (brand) {
            const brandExist = await this.brandRepo.findOne({ filter: { _id: brand } })
            if (!brandExist) {
                throw new BadRequestException('brand not found')
            }

        }

    if ( price && discount){
        price = price - (price * (discount / 100))
    } else if (price){
        price = price - (price * (product.discount/ 100))

    }else if(discount){
        price = product.price - (product.price * (discount/ 100))

    }


    if (stock){
        if (stock > product.quantity){
        throw new BadRequestException("stock should be less than quantity")
        }
    }

    product = await this.ProductRepo.findOneAndUpdate({
        filter: {_id : id},
        update:{
            ...body,
            price,
            discount,
            stock,
            quantity
        },
        options:{new:true}
    })

   

       return product
    }
    // 3-----------------------Api : wish List products
    async addToWishListProduct(
        user: HUserDocument,
        id:Types.ObjectId, // = paramDto
    ) {

       let product = await this.ProductRepo.findOne({filter:{_id:id}})
       if(!product){
        throw new BadRequestException("Product not found")
       }

        let userExist = await this.UserRepo.findOneAndUpdate({
            filter:{_id:user._id , wishList:{$in:id }} , 
            update:{
                $pull:{wishList:id}
            } , 
            options:{new:true}
        })

        if(!userExist){
            userExist = await this.UserRepo.findOneAndUpdate({
                filter:{_id:user._id} , 
                update:{
                    $push:{wishList:id}
                } , 
                options:{new:true}
            })
        }

        return userExist
     
    }



}


