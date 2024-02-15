import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbit/rabbitmq.service';
import * as fs from 'fs';
import * as path from 'path';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class FilesService {
  moduleRef: any;
  constructor(
    private socketService: SocketService,
    private readonly rabbitMQService: RabbitMQService
  ) {
    this.rabbitMQService.start();
  }

  async sentFile(image) {
    try {
      const message = JSON.stringify({ filename: 'image', imageData: image });
      await this.rabbitMQService.sendMessage(message);
      return { success: true };
    } catch (error) {
      console.log(error);
    }
  }

  async saveFile(message) { 
    const data = JSON.parse(message)
    const buffer = Buffer.from(data.imageData.buffer, 'base64');
    const fileName = data.filename
    const uploadDir = path.join(__dirname, '..', '..', '..', 'src', 'modules', 'files', 'savedImages')

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);
    this.socketService.handleSendImage(message)
  }
}