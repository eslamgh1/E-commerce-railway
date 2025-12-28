import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';


@ValidatorConstraint({ name: 'couponValidator', async: false })
export class couponValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    //value = dynamic value
    //args.object[args.constraints[0]] = password

    const obj = args.object as any
    const fromDate = new Date(obj.fromDate)
    const toDate = new Date(obj.toDate)
    
    const now = new Date()

    return fromDate >= now && fromDate < toDate
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return ` fromDate is not valid , should be greater than today `;
  }
}




