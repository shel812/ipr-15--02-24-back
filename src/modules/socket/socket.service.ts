import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})

export class SocketService implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    handleConnection(client) { 
    }

    handleSendImage(image) { 
        this.server.emit('image', image);
    }

}