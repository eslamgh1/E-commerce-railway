import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { TokenService } from "src/common/service/token.services";
import { JwtService } from "@nestjs/jwt";
import { UserModel, UserRepo } from "src/DB";

@Module({
    imports: [UserModel],
    controllers: [],
    providers: [SocketGateway,TokenService ,JwtService,UserRepo],
    exports: [] 
})
export class GatewayModule { }