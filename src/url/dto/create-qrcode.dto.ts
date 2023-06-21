import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateQrcodeDto {
  @ApiProperty({
    description: 'ShortURL ID',
    example: '421b3388',
  })
  @IsString({ message: 'ShortURL ID must be a string' })
  shortUrlId: string;
}
