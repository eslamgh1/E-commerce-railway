import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Types } from "mongoose";

import { Server, Socket } from "socket.io"
import { Auth, TokenTypeEnum, userRole } from "src/common";
import { Product } from "src/DB";


// @WebSocketGateway(80,

//     { namespace: '/socket',
//         cors: {
//             origin: "*",
//         }
//     })
// i will pass SocketGateway to cart service

@WebSocketGateway({
    namespace: '/socket',
    cors: {
        origin: '*',
    },
})

export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() { }

    @WebSocketServer()
    private io: Server   // private property  to use ====>  this.io

    // @Auth({
    //     role: [userRole.ADMIN, userRole.USER],
    //     typeToken: TokenTypeEnum.access
    //     })

    @SubscribeMessage('HI-I-am-listenerBE')
    handleSayHiEvent(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
        console.log(data)
        // socket.emit('backend', {message:"I am Full stack developer"}) // emit to specific client // use  @ConnectedSocket() socket:Socket
        this.io.emit('backend', { message: "I am Full stack developer" }) // emit to all clients
    }



    handleConnection(socket: Socket) {
        // console.log(socket)
        console.log(socket.id)
        console.log("Client connected")
    }

    handleDisconnect(socket: Socket) {
        console.log(socket.id)
        console.log("Client disconnected")
    }


    handleProductQunantityChange(productId: Types.ObjectId | String, quantity: number) {
        this.io.emit("productQunantityChange", { productId, quantity }) // emit to all front end clients

    }



}


