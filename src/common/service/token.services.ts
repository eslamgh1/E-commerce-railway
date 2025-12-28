import { BadRequestException, Injectable } from "@nestjs/common";

import { JwtPayload, sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { TokenTypeEnum } from "../enums";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { UserRepo } from "src/DB";


@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly UserRepo: UserRepo,
    ) { }

    //GenerateToken
    GenerateToken = async ({ payload, options }: {
        payload: Object,
        options?: JwtSignOptions

    }): Promise<string> => this.jwtService.signAsync(payload, options)


    //VerifyToken
    VerifyToken = async ({ token, options }: {
        token: string,
        options?: JwtVerifyOptions,
    }): Promise<JwtPayload> => {
        return this.jwtService.verifyAsync(token, options)
    }

    //&^ Generate signature based on token type and prefix
    GenerateSignature = async (prefix: string, tokenType: TokenTypeEnum = TokenTypeEnum.access) => {
        //&* tokenType: access
        if (tokenType === TokenTypeEnum.access) {
            if (prefix === process.env.BEARER_USER) {
                return process.env.SECRET_USER_TOKEN
            } else if (prefix === process.env.BEARER_ADMIN) {
                return process.env.SECRET_ADMIN_TOKEN
            } else {
                return null
            }
        }


        //&* tokenType: refresh
        if (tokenType === TokenTypeEnum.refresh) {
            if (prefix === process.env.BEARER_USER) {
                return process.env.SECRET_REFRESH_USER_TOKEN
            } else if (prefix === process.env.BEARER_ADMIN) {
                return process.env.SECRET_REFRESH_ADMIN_TOKEN
            } else {

                return null
            }
        }
        //&* Finally: if no condition matches:
        return null
    }

    //&^ DecodeTokenAndFetchUser 
    DecodeTokenAndFetchUser = async (token: string, signature: string) => {
        const decoded = await this.VerifyToken({ token, options: { secret: signature } });
        if (!decoded.email) {
            throw new BadRequestException("Invalid Token");
        }
        //* fetch user from DB:
        const user = await this.UserRepo.findOne({ filter: { email: decoded.email } });
        if (!user) {
            throw new BadRequestException("Email does not exist");
        }

        if (!user?.confirmed) {
            throw new BadRequestException("Please confirm the email or you are freezed");
        }
        // //* check if token is revoked:
        // if (await _revokeToken.findOne({ tokenId: decoded?.jti! })) {
        //     throw new BadRequestException("Token has been revoked from current device , Please login again");
        // }
        // //* check if user changed his credentials after the token was issued:
        // //(decoded?.iat! * 1000) to change it to milliseconds
        // if (user?.changeCredentials?.getTime()! > (decoded?.iat! * 1000)) {
        //     throw new BadRequestException("changeCredentials has been happedned or Token has been revoked from all devices , Please login again", 401);
        // }

        return {user,decoded}

    }

}




