import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { limits: { files: 1, fileSize: 5e6 } }),
  )
  sentFile(@UploadedFile() image) {
    return this.filesService.sentFile(image);
  }

}
