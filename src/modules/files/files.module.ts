import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { RabbitMQModule } from '../rabbit/rabbitmq.module';
import { forwardRef } from '@nestjs/common';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [RabbitMQModule, SocketModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
