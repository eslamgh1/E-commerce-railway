import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BadRequestException, Injectable } from "@nestjs/common";
import { storageTypeEnum } from "../enums";
import { createReadStream } from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Upload } from "@aws-sdk/lib-storage";



@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION! as string,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            },
        })
    }

    //&===================== Upload File =====================//
  uploadFile = async ({
  storeType = storageTypeEnum.memory,
  Bucket = process.env.AWS_BUCKET_NAME!,
  path,
  ACL = "private" as ObjectCannedACL,
  file,
}: {
  storeType?: storageTypeEnum,
  Bucket?: string;
  path: string | undefined;
  ACL?: ObjectCannedACL;
  file: Express.Multer.File;
}): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `${process.env.APPLICATION_NAME}/${path}/${Date.now()}_${file.originalname}`,
    Body: storeType === storageTypeEnum.memory ? file.buffer : createReadStream(file.path),
    ContentType: file.mimetype,
  });

  await this.s3Client.send(command);
  if (!command.input.Key) {
    throw new BadRequestException("File upload failed")
  }
  return command.input.Key;
}
//&===================== Upload Large File =====================//
  uploadLargeFile = async (
  {
    storeType = storageTypeEnum.disk,
    Bucket = process.env.AWS_BUCKET_NAME!,
    path = "general",
    ACL = "private" as ObjectCannedACL,
    file,
  }: {
    storeType?: storageTypeEnum,
    Bucket?: string;
    path: string | undefined;
    ACL?: ObjectCannedACL;
    file: Express.Multer.File;
  }
): Promise<string> => {
  const upload = new Upload({
    client: this.s3Client,
    params: {
      Bucket,
      ACL,
      Key: `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${file.originalname}`,
      Body: storeType === storageTypeEnum.memory ? file.buffer : createReadStream(file.path),
      ContentType: file.mimetype,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
  });

  const { Key } = await upload.done();
  if (!Key) {
    throw new BadRequestException("File upload failed")
  }
  return Key;
}
//&===================== Upload Multiple Files =====================//
  uploadFiles = async ({
  storeType = storageTypeEnum.memory,
  Bucket = process.env.AWS_BUCKET_NAME!,
  path = "general",
  ACL = "private" as ObjectCannedACL,
  files,
  useLarge = false,
}: {
  storeType?: storageTypeEnum,
  Bucket?: string,
  path: string | undefined,
  ACL?: ObjectCannedACL,
  files: Express.Multer.File[],
  useLarge?: boolean,
}) => {

  let urls: string[] = []
  if (useLarge == true) {
    urls = await Promise.all(files.map(file => this.uploadLargeFile({ storeType, Bucket, path, ACL, file })))
  } else {
    urls = await Promise.all(files.map(file => this.uploadFile({ storeType, Bucket, path, ACL, file })))
  }
  return urls;
}
//&===================== Upload pre signed URL =====================//
// export const createUploadFilePresignedUrl = async ({
//   Bucket = process.env.AWS_BUCKET_NAME!,
//   path = "general",
//   OriginalName,
//   ContentType,
//   expiresIn = 60 * 60
// }: {
//   path?: string,
//   Bucket?: string
//   OriginalName: string,
//   ContentType: string,
//   expiresIn?: number,

// }) => {
//   const command = new PutObjectCommand({
//     Bucket,
//     Key: `${process.env.APPLICATION_NAME}/${path}/${Date.now()}_${OriginalName}`,
//     ContentType,
//   });

//   const url = await getSignedUrl(s3Client(), command, { expiresIn });
//   return url // Add this line here
// }

  createUploadFilePresignedUrl = async ({
  Bucket = process.env.AWS_BUCKET_NAME!,
  path = "general",
  OriginalName,
  ContentType,
  expiresIn = 60 * 60
}: {
  path?: string;
  Bucket?: string;
  OriginalName: string;
  ContentType: string;
  expiresIn?: number;
}): Promise<{ url: string; Key: string }> => {

  const Key = `${process.env.APPLICATION_NAME}/${path}/${randomUUID()}_${OriginalName}`;
  
  const command = new PutObjectCommand({
    Bucket,
    Key,
    ContentType,
  });
  
  const url = await getSignedUrl(this.s3Client, command, { expiresIn });

  return { url, Key };
};
// //&===================== Get file /download =====================//
  getFile = async (
  { Bucket = process.env.AWS_BUCKET_NAME!,
    path,
  }: {
    Bucket?: string,
    path: string
  }
) => {
  const command = new GetObjectCommand({
    Bucket,
    Key:path,
  });
  return await this.s3Client.send(command);
}
//&===================== Get file /pre signed download =====================//

  createGetFilePresignedUrl = async (
  { Bucket = process.env.AWS_BUCKET_NAME!,
    Key,
    expiresIn = 60 * 5,
    downLoadName,
  }: {
    Bucket?: string,
    Key: string,
    expiresIn?: number
    downLoadName?: string | undefined,
  }
) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition: downLoadName ? `attachment; filename="${downLoadName}"` : undefined,
  });
  const url = await getSignedUrl(this.s3Client, command, { expiresIn });
  return url;
}

//&===================== DeleteFile =====================//

  deleteFile = async (
  { Bucket = process.env.AWS_BUCKET_NAME!,
    Key,
  }: {
    Bucket?: string,
    Key: string
  }
) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key,
  });
  return await this.s3Client.send(command);

}

//&===================== DeleteFiles =====================//

  deleteFiles = async (
  { Bucket = process.env.AWS_BUCKET_NAME!,
    urls,
    Quiet = false,

  }: {
    Bucket?: string,
    urls: string[],
    Quiet?: boolean,
  }
) => {
  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: {
      Objects: urls.map(url => ({ Key: url })),
      Quiet,
    }}
  ) ;

  return await this.s3Client.send(command);

}

//&===================== Get list files =====================//

  listFiles = async (
  { Bucket = process.env.AWS_BUCKET_NAME!,
    path,

  }: {
    Bucket?: string,
    path: string,

  }
) => {
  const command = new ListObjectsV2Command({
    Bucket,
    Prefix: `${process.env.APPLICATION_NAME}/${path}`}
  ) ;

  return await this.s3Client.send(command);

}
}