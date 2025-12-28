import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, QueryDto, updateCategoryDto } from './category.dto';
import { Brand, BrandRepo, CategoryRepo, HUserDocument } from 'src/DB';
import { S3Service } from 'src/common';
import { Types } from 'mongoose';
import { randomUUID } from 'crypto';


@Injectable()
export class CategoryService {
    // inject Category repo
    constructor(
        private readonly CategoryRepo: CategoryRepo,
        private readonly s3Service: S3Service,
        private readonly brandRepo: BrandRepo

    ) { }

    // 1-----------------------Api : create Category service
    async createCategory(CategoryDto: CreateCategoryDto, user: HUserDocument, file: Express.Multer.File) {
        const { name, slogan, brands } = CategoryDto;

        const CategoryExist = await this.CategoryRepo.findOne({ filter: { name } })

        if (CategoryExist) {
            throw new ConflictException('Category already exist')
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

        const Category = await this.CategoryRepo.create({
            name,
            slogan,
            image: url,
            createdBy: user._id,
            assetFolderId,
            brands: strictIds
        })


        if (!Category) {
            await this.s3Service.deleteFile({

                Key: url
            })
            throw new InternalServerErrorException('Faild to create Category')
        }

        return Category
    }

    // 2-----------------------Api : update Category service
    async updateCategory(id: Types.ObjectId, CategoryDto: updateCategoryDto, user: HUserDocument) {
        const { name, slogan ,brands } = CategoryDto
        const Category = await this.CategoryRepo.findOne({ filter: { _id: id, createdBy: user._id } })
        if (!Category) {
            throw new NotFoundException('Category not found or owned by another user')
        }

        if (name && await this.CategoryRepo.findOne({ filter: { name } })) {
            throw new ConflictException('Category already exist')
        }


        const strictIds = [...new Set(brands || [])]
        if (brands && (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } })).length !== strictIds.length) {
            throw new NotFoundException('Brand not found');
        }

        const updatedCategory = await this.CategoryRepo.findOneAndUpdate({
            filter: { _id: id, createdBy: user._id },
            update: { name, slogan ,brands:strictIds },
            options: { new: true }
        })

        return updatedCategory

    }
    // 3-----------------------Api : [update image service]

    async updateCategoryImage(
        id: Types.ObjectId,
        file: Express.Multer.File,
        user: HUserDocument) {

        const Category = await this.CategoryRepo.findOne({ filter: { _id: id, createdBy: user._id } })
        if (!Category) {
            throw new NotFoundException('Category not found or owned by another user')
        }


        const url = await this.s3Service.uploadFile(
            { file,
              path: `categories/${Category.assetFolderId}`})

        const updatedCategory = await this.CategoryRepo.findOneAndUpdate({
            filter: { _id: id, createdBy: user._id },
            update: { image: url },
            options: { new: true }
        })

        if (!updatedCategory) {
            await this.s3Service.deleteFile({
                Key: url
            })
            throw new InternalServerErrorException('Faild to update Category image')
        }

        const deletedImage = await this.s3Service.deleteFile({
            Key: Category.image
        })

        return updatedCategory
    }
    // 4-----------------------Api : [Freeze Category service]
    async freezeCategory(id: Types.ObjectId, user: HUserDocument) {
        const Category = await this.CategoryRepo.findOneAndUpdate(
            {
                filter: { _id: id, deletedAt: { $exists: false } },
                update: { deletedAt: new Date(), updatedBy: user._id }, options: { new: true }
            })


        if (!Category) {
            throw new NotFoundException('Category not found or  deleted')
        }

        return Category
    }
    // 5-----------------------Api : [Restore Category service]
    async restoreCategory(id: Types.ObjectId, user: HUserDocument) {
        const Category = await this.CategoryRepo.findOneAndUpdate(
            // MUST make paranoid false to allow update soft deletedAt as our hook = 
            // paranoid:false === return soft deleted Category
            {
                filter: { _id: id, deletedAt: { $exists: true }, paranoid: false },
                update: { $unset: { deletedAt: "" }, restoredAt: new Date(), updatedBy: user._id }, options: { new: true }
            })

        if (!Category) {
            throw new NotFoundException('Category not found or  deleted')
        }
        return Category
    }

    // 6-----------------------Api : [Delete Category service]
    async deleteCategory(id: Types.ObjectId) {
        const deletedCategory = await this.CategoryRepo.findOneAndDelete(
            {
                filter: { _id: id, deletedAt: { $exists: true }, paranoid: false },

            })

        if (!deletedCategory) {
            throw new NotFoundException('Category not found or not soft deleted or owned by another user')
        }

        await this.s3Service.deleteFile({
            Key: deletedCategory.image
        })

        return deletedCategory
    }

    //7-------------------------Api: get All Categorys
    async getAllCategorys(query: QueryDto) {
        const { page = 1, limit = 1, search } = query
        const { currentPage, totalDocs, numPages, docs } = await this.CategoryRepo.paginate({
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
        return { message: "Done All Categorys", currentPage, totalDocs, numPages, docs }
    }



}


