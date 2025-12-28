
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.services';
import { Reflector } from '@nestjs/core';
import { tokenName } from '../decorators';

@Injectable()
export class AuthunticationGuard implements CanActivate {

    constructor(
        private readonly tokenService: TokenService,
        private reflector: Reflector
    ) { }


    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const typeToken = this.reflector.get(tokenName, context.getHandler());
        // console.log({typeToken});

        // console.log({type:context.getType()})

        // console.log({type:context['contextType']})

        let req: any;
        let authorization: string = ""

        if (context.getType() === 'http') {
            req = context.switchToHttp().getRequest();
            authorization = req.headers?.authorization!;
        }
        else if (context.getType() === 'ws') {
            req = context.switchToWs().getClient();
            authorization = req.handshake.headers.authorization;
        } else if (context.getType() === 'rpc') {

        }

        try {

            if (!authorization) {
                throw new BadRequestException("Provide us with token");
            }

            //& split the token
            const [prefix, token] = authorization?.split(" ") || [];
            if (!prefix || !token) {
                throw new BadRequestException("Provide us with valid token/prefix");
            }
            //& generate signature
            const signature = await this.tokenService.GenerateSignature(prefix, typeToken)
            if (!signature) {
                throw new BadRequestException("Invalid Signature");
            }

            //& decode token and fetch user
            const { user, decoded } = await this.tokenService.DecodeTokenAndFetchUser(token, signature);


            if (!decoded) {
                throw new BadRequestException("Invalid Token decoded");
            }

            req.user = user;
            req.decoded = decoded;
            return true;


        } catch (error) {
            throw new BadRequestException("Invalid Token");
        }



        return true;
    }
}
