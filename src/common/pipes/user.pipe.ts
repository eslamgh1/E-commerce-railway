
// import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

// @Injectable()
// export class ValidationPipe implements PipeTransform {
//   transform(value: any, metadata: ArgumentMetadata) {
//     console.log(value,metadata)
//   if(value.password !== value.cPassword){
//     throw new HttpException('Password do not match',HttpStatus.BAD_REQUEST)
//   }
//   }
// }


// import { PipeTransform, ArgumentMetadata, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
// import { ZodType } from 'zod';

// constructor(private : ZodSchema) {} schema as a parameter because it is not fixed
// export class ZodValidationPipe implements PipeTransform {
//   constructor(private schema: ZodType) {}

//   transform(value: unknown, metadata: ArgumentMetadata) {

//       const {success, error } = this.schema.safeParse(value);
//       if(!success){
//         throw new HttpException({
//           message: error.issues.map((issue) => issue.message),
//           code: HttpStatus.BAD_REQUEST
//         },HttpStatus.BAD_REQUEST)
//       }
//       return value;
    
//   }
// }
