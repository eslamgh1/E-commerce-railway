import {  ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';


// custom decorator is used in Class layer
export function AtLeastOne(requiredFields: string[], validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: "",
      options: validationOptions,
      constraints: requiredFields,
      validator: {
        validate(value: string, args: ValidationArguments) {
      // args return name and slogan
          return requiredFields.some(field => args.object[field]);
        },

        defaultMessage(args: ValidationArguments) {
          // here you can provide default error message if validation failed
          return `At least one of ${requiredFields.join(', ')} is missing`;
        }
      }
    });
  }

}