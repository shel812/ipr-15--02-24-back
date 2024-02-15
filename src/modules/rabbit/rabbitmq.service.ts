import { Injectable } from '@nestjs/common';
import { rabbitmqConfig } from './rabbitmq.config';
import * as amqp from 'amqplib';
import { FilesService } from '../files/files.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class RabbitMQService {
    private connection: amqp.Connection;
    private filesService: FilesService;

    constructor(private readonly moduleRef: ModuleRef) {}

    async start(): Promise<void> {
        try {
          this.connection = await amqp.connect(rabbitmqConfig.uri);
          console.log('Соединение с RabbitMQ установлено');
          this.filesService = this.moduleRef.get(FilesService, { strict: false });
          await this.receiveMessage();
        } catch (error) {
          console.log(error.message)
        }
    }

    public async sendMessage(message: string): Promise<void> {
        try {
          if (!this.connection) {
            console.log('Не установлено соединение')
          }
      
          const channel = await this.connection.createChannel();
          await channel.assertQueue(rabbitmqConfig.queue, { durable: false });
          channel.sendToQueue(rabbitmqConfig.queue, Buffer.from(message));
          console.log('Отправлено сообщение');
        } catch (error) {
          console.log(error.message)
        }
      }

    public async receiveMessage(): Promise<void> {
        if (!this.connection) {
            console.log('Не установлено соединение')
        }
        const channel = await this.connection.createChannel();
        await channel.assertQueue(rabbitmqConfig.queue, { durable: false });
        console.log('Ожидаем сообщения...');
        channel.consume(
        rabbitmqConfig.queue,
        async (msg) => {
            console.log(`Получено сообщение`);
            await this.filesService.saveFile(msg.content.toString());
        },
        { noAck: true },
        );
    }
}
