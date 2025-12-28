import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';

// custom decorator to validate ids 
// it is a function that takes a function as an argument and returns a function.
// it works inside the class-validator
@ValidatorConstraint({ name: 'IdsMongo', async: false })
export class IdsMongo implements ValidatorConstraintInterface {
  validate(ids: string[], args: ValidationArguments) {
    //value = cPassword
    //args.object[args.constraints[0]] = password
    return ids.filter(id => Types.ObjectId.isValid(id)).length ===ids.length
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return ` id is not valid ${args.constraints[0]} `;
  }
}




