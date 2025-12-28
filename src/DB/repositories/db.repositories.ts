import { DeleteResult, HydratedDocument, Model, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from 'mongoose';

export abstract class DBRepo<TDocument> {

  constructor(protected readonly model: Model<TDocument>) { }

// create method
  async create(data: Partial<TDocument>): Promise<HydratedDocument<TDocument>> {

    return this.model.create(data);
  }
  // ref: 8-paginate [ Socket Folder]
  // create find one method
  // async findOne(
  //   filter: RootFilterQuery<TDocument>, 
  //   projection?: ProjectionType<TDocument>, // projection insteaf of select?
  //   options?: QueryOptions<TDocument>): Promise<HydratedDocument<TDocument> | null> {

  //   return this.model.findOne(filter, projection, options)
  // }

  // Refactored version (using named parameters)
  async findOne({
  filter,
  projection,
  options,
}: {
  filter: RootFilterQuery<TDocument>;
  projection?: ProjectionType<TDocument>;
  options?: QueryOptions<TDocument>;
}): Promise<HydratedDocument<TDocument> | null> {
  return this.model.findOne(filter, projection, options);
}





  // create find method
  async find({ filter, projection, options }: {
    filter: RootFilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>
  }

  ): Promise<HydratedDocument<TDocument>[]> {
    return this.model.find(filter, projection, options);
  }


  // create paginate method
  async paginate({ filter, select, options, query }: {
    filter: RootFilterQuery<TDocument>,
    select?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
    query: { page?: number, limit?: number }
  }

  ): Promise<{ docs: HydratedDocument<TDocument>[], currentPage: number, totalDocs: number, numPages: number }> {

    let { page = 1, limit = 5 } = query as unknown as { page: number, limit: number }
    if (page < 0) page = 1  // minum number of p.g =1
    page = page * 1 || 1  // convert sting to type number by multiply by 1
    const skip = (page - 1) * limit // skip number of doc

    const finalOptions = { ...options, skip, limit }

    const counts = await this.model.countDocuments({ deletedAt: { $exists: false } }) // total number of docs
    const numPages = Math.ceil(counts / limit)

    const docs = await this.model.find(filter, select, finalOptions);

    return { docs, currentPage: page, totalDocs: counts, numPages }
  }

// create update method
  async updateOne(filter: RootFilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<import('mongoose').UpdateWriteOpResult> {
    return await this.model.updateOne(filter, update);
  }

// create update one method
  async findOneAndUpdate(
    {
      filter,
      update,
      options
    }: {
      filter: RootFilterQuery<TDocument>,
      update: UpdateQuery<TDocument>,
      options: QueryOptions<TDocument> 
    }): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOneAndUpdate(filter, update ,{new:true});
  }

// find one and delete method
  async findOneAndDelete({
    filter
  }: {
    filter: RootFilterQuery<TDocument>}): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOneAndDelete(filter);
  }

  
// create update many method
  async updateMany(filter: RootFilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<import('mongoose').UpdateWriteOpResult> {
    return await this.model.updateMany(filter, update);
  }

// create delete method
  // async deleteOne(filter: RootFilterQuery<TDocument>): Promise<DeleteResult> {
  //   return this.model.deleteOne(filter);
  // }

  async deleteOne({
  filter,
}: {
  filter: RootFilterQuery<TDocument>;
}): Promise<DeleteResult> {
  return this.model.deleteOne(filter);
}

}

