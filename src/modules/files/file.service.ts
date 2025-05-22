import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  uploadFile(uploadFileDto: any) {
    const file = this.fileRepository.create(uploadFileDto);
    return this.fileRepository.save(file);
  }

  getFile(id: number) {
    return this.fileRepository.findOne({ where: { id } });
  }
}
