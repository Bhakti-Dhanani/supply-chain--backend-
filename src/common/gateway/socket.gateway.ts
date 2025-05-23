import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  sendNotificationToUser(userId: number, notification: any) {
    if (!this.server) {
      // Optionally log or throw a more descriptive error
      console.error('Socket server not initialized');
      return;
    }
    this.server.to(`user_${userId}`).emit('notification', notification);
  }
}
