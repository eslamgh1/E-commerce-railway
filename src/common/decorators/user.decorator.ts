import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';


@ValidatorConstraint({ name: 'matchFields', async: false })
export class MatchFields implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    //value = cPassword
    //args.object[args.constraints[0]] = password
    return value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `${args.property} not match ${args.constraints[0]}`;
  }
}


export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: MatchFields, // it is a class that implements ValidatorConstraintInterface
    });
  };
}


// user decorator as custom decorator
export const Userdecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


