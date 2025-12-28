import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto, QueryDto, updateSubCategoryDto } from './subCategory.dto';
import {  BrandRepo, HUserDocument } from 'src/DB';
import { S3Service } from 'src/common';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';
import { SubCategoryRepo } from 'src/DB/repositories/subCategory.repositories';


@Injectable()
export class SubCategoryService {
    // inject SubCategory repo
    constructor(
        private readonly SubCategoryRepo: SubCategoryRepo,
        private readonly s3Service: S3Service,
        private readonly brandRepo: BrandRepo,

    ) { }

    // 1-----------------------Api : create SubCategory service
    async createSubCategory(SubCategoryDto: CreateSubCategoryDto, user: HUserDocument, file: Express.Multer.File) {
        const { name, slogan, brands } = SubCategoryDto;

        const SubCategoryExist = await this.SubCategoryRepo.findOne({ filter: { name } })

        if (SubCategoryExist) {
            throw new ConflictException('SubCategory already exist')
        }

        const strictIds = [...new Set(brands || [])]
        // console.log(strictIds)
        // console.log(brands)

        // Check if brands exists, AND (found length is NOT equal to expected length)

        if (brands && (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } })).length !== strictIds.length) {
            throw new NotFoundException('Brand not found');
        }


        const assetFolderId = randomUUID()

        // uploadFile return but the key/path  anot full URL
        const url = await this.s3Service.uploadFile(
            {
                file,
                path: `categories/${assetFolderId}`
            })

        const SubCategory = await this.SubCategoryRepo.create({
            name,
            slogan,
            image: url,
            createdBy: user._id,
            assetFolderId,
            brands: strictIds
        })


        if (!SubCategory) {
            await this.s3Service.deleteFile({

                Key: url
            })
            throw new InternalServerErrorException('Faild to create SubCategory')
        }

        return SubCategory
    }

    // 2-----------------------Api : update SubCategory service
    async updateSubCategory(id: Types.ObjectId, SubCategoryDto: updateSubCategoryDto, user: HUserDocument) {
        const { name, slogan ,brands } = SubCategoryDto
        const SubCategory = await this.SubCategoryRepo.findOne({ filter: { _id: id, createdBy: user._id } })
        if (!SubCategory) {
            throw new NotFoundException('SubCategory not found or owned by another user')
        }

        if (name && await this.SubCategoryRepo.findOne({ filter: { name } })) {
            throw new ConflictException('SubCategory already exist')
        }


        const strictIds = [...new Set(brands || [])]
        if (brands && (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } })).length !== strictIds.length) {
            throw new NotFoundException('Brand not found');
        }

        const updatedSubCategory = await this.SubCategoryRepo.findOneAndUpdate({
            filter: { _id: id, createdBy: user._id },
            update: { name, slogan ,brands:strictIds },
            options: { new: true }
        })

        return updatedSubCategory

    }
    // 3-----------------------Api : [update image service]

    async updateSubCategoryImage(
        id: Types.ObjectId,
        file: Express.Multer.File,
        user: HUserDocument) {

        const SubCategory = await this.SubCategoryRepo.findOne({ filter: { _id: id, createdBy: user._id } })
        if (!SubCategory) {
            throw new NotFoundException('SubCategory not found or owned by another user')
        }


        const url = await this.s3Service.uploadFile(
            { file,
              path: `categories/${SubCategory.assetFolderId}`})

        const updatedSubCategory = await this.SubCategoryRepo.findOneAndUpdate({
            filter: { _id: id, createdBy: user._id },
            update: { image: url },
            options: { new: true }
        })

        if (!updatedSubCategory) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException('Faild to update SubCategory image')
        }

        const deletedImage = await this.s3Service.deleteFile({
            Key: SubCategory.image
        })

        return updatedSubCategory
    }
    // 4-----------------------Api : [Freeze SubCategory service]
    async freezeSubCategory(id: Types.ObjectId, user: HUserDocument) {
        const SubCategory = await this.SubCategoryRepo.findOneAndUpdate(
            {
                filter: { _id: id, deletedAt: { $exists: false } },
                update: { deletedAt: new Date(), updatedBy: user._id }, options: { new: true }
            })


        if (!SubCategory) {
            throw new NotFoundException('SubCategory not found or  deleted')
        }

        return SubCategory
    }
    // 5-----------------------Api : [Restore SubCategory service]
    async restoreSubCategory(id: Types.ObjectId, user: HUserDocument) {
        const SubCategory = await this.SubCategoryRepo.findOneAndUpdate(
            // MUST make paranoid false to allow update soft deletedAt as our hook = 
            // paranoid:false === return soft deleted SubCategory
            {
                filter: { _id: id, deletedAt: { $exists: true }, paranoid: false },
                update: { $unset: { deletedAt: "" }, restoredAt: new Date(), updatedBy: user._id }, options: { new: true }
            })

        if (!SubCategory) {
            throw new NotFoundException('SubCategory not found or  deleted')
        }
        return SubCategory
    }

    // 6-----------------------Api : [Delete SubCategory service]
    async deleteSubCategory(id: Types.ObjectId) {
        const deletedSubCategory = await this.SubCategoryRepo.findOneAndDelete(
            {
                filter: { _id: id, deletedAt: { $exists: true }, paranoid: false },

            })

        if (!deletedSubCategory) {
            throw new NotFoundException('SubCategory not found or not soft deleted or owned by another user')
        }

        await this.s3Service.deleteFile({
            Key: deletedSubCategory.image
        })

        return deletedSubCategory
    }

    //7-------------------------Api: get All SubCategorys
    async getAllSubCategorys(query: QueryDto) {
        const { page = 1, limit = 1, search } = query
        const { currentPage, totalDocs, numPages, docs } = await this.SubCategoryRepo.paginate({
            filter: {
                ...search ? {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { slogan: { $regex: search, $options: 'i' } }
                    ]
                } : {}
            },

            query: {
                page,
                limit,
            }
        })
        return { message: "Done All SubCategorys", currentPage, totalDocs, numPages, docs }
    }



}


