import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBrandDto, QueryDto, updateBrandDto } from './brand.dto';
import { HUserDocument } from 'src/DB';
import { BrandRepo } from 'src/DB/repositories/brand.repositories';
import { S3Service } from 'src/common';
import { Types } from 'mongoose';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class BrandService {
    // inject brand repo
    constructor(
        private readonly brandRepo: BrandRepo,
        private readonly s3Service: S3Service,
        @Inject(CACHE_MANAGER) private cacheManager: Cache


    ) { }

    // 1-----------------------Api : create brand service
    async createBrand(brandDto: CreateBrandDto, user: HUserDocument, file: Express.Multer.File) {
        const { name, slogan } = brandDto

        const brandExist = await this.brandRepo.findOne({ filter: { name } })

        if (brandExist) {
            throw new ConflictException('Brand already exist')
        }

        // uploadFile return but the key/path  anot full URL
        const url = await this.s3Service.uploadFile({ file, path: 'brand' })

        const brand = await this.brandRepo.create({
            name,
            slogan,
            image: url,
            createdBy: user._id
        })


        if (!brand) {
            await this.s3Service.deleteFile({

                Key: url
            })
            throw new InternalServerErrorException('Faild to create brand')
        }

        return brand
    }
    // 2-----------------------Api : update brand service
    async updateBrand(id: Types.ObjectId, brandDto: updateBrandDto, user: HUserDocument) {
        const { name, slogan } = brandDto
        const brand = await this.brandRepo.findOne({ filter: { _id:id , createdBy:user._id } })
        if (!brand) {
            throw new NotFoundException('Brand not found or owned by another user')
        }

        if (name && await this.brandRepo.findOne({ filter: { name } })) {
            throw new ConflictException('Brand already exist')
        }

        const updatedBrand = await this.brandRepo.findOneAndUpdate({filter:{_id:id , createdBy:user._id},
            update:{name,slogan},
            options:{new:true}
        })

        return updatedBrand
        // if(slogan){
        //     brand.slogan = slogan
        // }
        // brand.name = name as unknown as string
        // await brand.save()  
    }
    // 3-----------------------Api : [update image service]

    async updateBrandImage(
        id: Types.ObjectId, 
        file: Express.Multer.File, 
        user: HUserDocument) 
        {

        const brand = await this.brandRepo.findOne({ filter: { _id:id , createdBy:user._id } })
        if (!brand) {
            throw new NotFoundException('Brand not found or owned by another user')
        }


            const url = await this.s3Service.uploadFile({ file, path: 'brand' })

            const updatedBrand = await this.brandRepo.findOneAndUpdate({
                filter:{_id:id , createdBy:user._id},
                update:{image:url},
                options:{new:true}
            })

            if(!updatedBrand){
                await this.s3Service.deleteFile({
                    Key: url
                })
                throw new InternalServerErrorException('Faild to update brand image')
            }

            const deletedImage = await this.s3Service.deleteFile({
                Key: brand.image
            })

            return updatedBrand
    }
    // 4-----------------------Api : [Freeze brand service]
    async freezeBrand(id: Types.ObjectId, user: HUserDocument) {
        const brand = await this.brandRepo.findOneAndUpdate(
            { filter: { _id:id , deletedAt:{$exists:false   } } ,
            update: {deletedAt:new Date(),updatedBy:user._id},  options:{new:true}
        })


        if (!brand) {
            throw new NotFoundException('Brand not found or  deleted')
        }

        return brand
    }
    // 5-----------------------Api : [Restore brand service]
    async restoreBrand(id: Types.ObjectId, user: HUserDocument) {
        const brand = await this.brandRepo.findOneAndUpdate(
            // MUST make paranoid false to allow update soft deletedAt as our hook = 
            // paranoid:false === return soft deleted brand
            { filter: { _id:id , deletedAt:{$exists:true   } ,paranoid:false} ,
            update: {$unset:{deletedAt:""}, restoredAt:new Date(), updatedBy:user._id},  options:{new:true}
        })

        if (!brand) {
            throw new NotFoundException('Brand not found or  deleted')
        }
        return brand
    }

    // 6-----------------------Api : [Delete brand service]
    async deleteBrand(id: Types.ObjectId) {
        const deletedBrand = await this.brandRepo.findOneAndDelete(
            { filter: { _id:id , deletedAt:{$exists:true   } ,paranoid:false } ,
   
        })

        if (!deletedBrand) {
            throw new NotFoundException('Brand not found or not soft deleted or owned by another user')
        }
        
        await this.s3Service.deleteFile({
            Key: deletedBrand.image
        })

        return deletedBrand
    }

    //7-------------------------Api: get All brands
    async getAllBrands(query:QueryDto) {
        const {page = 1,limit = 1  ,search} = query
        const {currentPage ,totalDocs ,numPages ,docs} = await this.brandRepo.paginate({
                  filter:{ 
                ...search ? {
                    $or:[
                        {name:{$regex:search,$options:'i'}},
                        {slogan:{$regex:search,$options:'i'}}
                    ]
                } : {}
            },
            // filter:{ 
            //     ...search ? {name:{$regex:search,$options:'i'}} : {}
            // },
          query:{
            page,
            limit,
          }
        })
        return {message:"Done All brands", currentPage  ,totalDocs ,numPages,docs }
    }
    //8-------------------------Api: get All brands with cashing
    async getAllBrandsCashing(query:QueryDto) {
        // const {page = 1,limit = 1  ,search} = query
        // const {currentPage ,totalDocs ,numPages ,docs} = await this.brandRepo.paginate({
        //           filter:{ 
        //         ...search ? {
        //             $or:[
        //                 {name:{$regex:search,$options:'i'}},
        //                 {slogan:{$regex:search,$options:'i'}}
        //             ]
        //         } : {}
        //     },
        //     // filter:{ 
        //     //     ...search ? {name:{$regex:search,$options:'i'}} : {}
        //     // },
        //   query:{
        //     page,
        //     limit,
        //   }
        // })
        // return {message:"Done All brands", currentPage  ,totalDocs ,numPages,docs }


        let brands = await this.cacheManager.get("brands")
        if(!brands){
            console.log("cashing test")
            await this.brandRepo.find({filter:{}})
            await this.cacheManager.set("brands" ,brands)
        }

        return brands

    }



}


