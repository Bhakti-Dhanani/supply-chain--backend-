import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;
}
