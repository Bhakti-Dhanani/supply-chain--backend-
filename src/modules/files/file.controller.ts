import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  uploadFile(@Body() uploadFileDto: any) {
    return this.fileService.uploadFile(uploadFileDto);
  }

  @Get(':id')
  getFile(@Param('id') id: number) {
    return this.fileService.getFile(id);
  }
}
