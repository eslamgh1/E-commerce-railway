import { Body, Controller, Get, MaxFileSizeValidator, ParseFilePipe, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { confirmEmailDto, loginDto, ResendOtpDto, UserDto } from '../dto/user.dto';
import { UserService } from './user.service';
import type { HUserDocument } from 'src/DB';
import {  Userdecorator } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';

import { LoggingInterceptor } from 'src/common/Interceptors';
import { fileValidation, multerCloud, multerLocal } from 'src/common/utils';

import {  TokenTypeEnum, userRole } from 'src/common';


// @UseInterceptors(LoggingInterceptor)    
@Controller('users')
export class UserController {
    //userDto is a class that is used to validate the data that is sent to the server
    constructor(private readonly userService: UserService) { }

    //signUp method is used to register a new user
    @Post("signup")
    async signUp(@Body() body: UserDto) {
        // Await the service method (since it's async)
        return await this.userService.signUp(body);
    }

    //resendOtp method is used to resend the otp to the user
    @Post("resendotp")
    async resendOtp(@Body() body: ResendOtpDto) {

        return await this.userService.ResendOtp(body);
    }

    @Patch("confirmemail")
    async confirmEmail(@Body() body: confirmEmailDto) {

        return await this.userService.confirmEmail(body);
    }

    //login method is used to login a user
    @Post("login")
    async login(@Body() body: loginDto) {
        return await this.userService.login(body);
    }

//profile method is used to get the profile of the user
    @UseInterceptors(LoggingInterceptor)
    @Auth()
    @Get("profile")
    profile(
        @Userdecorator() user: HUserDocument
    ) {
        // console.log({req})
        return { message: "profile", user: user }
    }


//uploadFile method is used to upload a file
    @Auth({
        role:[userRole.USER],
        typeToken:TokenTypeEnum.access
        })
    @Post('upload')
    @UseInterceptors(FileInterceptor(
       "attachment", multerCloud({fileType:fileValidation.image})))
    async uploadFile(@UploadedFile() file: Express.Multer.File , @Userdecorator() user:HUserDocument) {
        const url = await this.userService.uploadFile(file ,user);
        // console.log(url)
        return {message:"file uploaded successfully" ,url}
    }


}
