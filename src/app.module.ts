import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './modules/files/files.module';
import { RabbitMQModule } from './modules/rabbit/rabbitmq.module';
import { SocketModule } from './modules/socket/socket.module';
import { SocketService } from './modules/socket/socket.service';

@Module({
  imports: [FilesModule, RabbitMQModule, SocketModule],
  controllers: [AppController],
  providers: [AppService, SocketService],
})
export class AppModule {}
