
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { TokenTypeEnum } from 'src/common';
import { UserWithRequest } from 'src/common/interfaces';
import { TokenService } from 'src/common/service/token.services';

export const tokenType =(typeToken:TokenTypeEnum = TokenTypeEnum.access)=>{
  return (req: UserWithRequest , res: Response , next: NextFunction)=>{
    req.typeToken = typeToken;

    next();
  }
}



@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

  constructor(
    private readonly tokenService: TokenService,
  ) { }


  async use(req: UserWithRequest, res: Response, next: NextFunction) {
    // const { authorization } = req.headers;

    // if (!authorization) {
    //   throw new BadRequestException("Provide us with token");
    // }
    // //& split the token
    // const [prefix, token] = authorization.split(" ") || [];
    // if (!prefix || !token) {
    //   throw new BadRequestException("Provide us with valid token/prefix");
    // }
    // //& generate signature
    // const signature = await this.tokenService.GenerateSignature(prefix)
    // if (!signature) {
    //   throw new BadRequestException("Invalid Signature");
    // }


    // //& decode token and fetch user
    // const { user, decoded } = await this.tokenService.DecodeTokenAndFetchUser(token, signature);


    // if (!decoded) {
    //   throw new BadRequestException("Invalid Token decoded");
    // }

    // req.user = user;
    // req.decoded = decoded;


    // return next();
  }
}
