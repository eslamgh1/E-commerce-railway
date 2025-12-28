import { Allow, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Length, Max, Min, registerDecorator, Validate, ValidateIf, ValidationOptions } from "class-validator";
import { IsMatch } from "src/common/decorators";
import { userGender } from "src/common/enums";

export class ResendOtpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class confirmEmailDto extends ResendOtpDto{
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class loginDto extends ResendOtpDto{
  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

}

//UserDto is a class that is used to validate the data that body is sent to the server
export class UserDto extends loginDto {
  @IsString()
  @Length(2, 255)
  @IsNotEmpty()
  // @ValidateIf((data : UserDto) =>Boolean(!data.userName))
  fName: string;

  @IsString()
  @Length(2, 255)
  @IsNotEmpty()
  lName: string;

  @IsNumber()
  @Min(15)
  @Max(95)
  @IsNotEmpty()
  age: number;  

  // @IsString()
  // userName: string;

  @IsEnum(userGender)
  gender:string



  //data === this  // true (conceptually) // ← 'this' is the instance
  @ValidateIf((data : UserDto) => {
    return Boolean(data.password)
  })

  @IsMatch(['password'],)
  cPassword: string;

}

//AdduserQueryDto is a class that is used to validate that query is sent to the server
export class AdduserQueryDto {
  @IsString({message: 'name must be a string'})
  @IsNotEmpty({message: 'query name is required'})
  name: string;


}