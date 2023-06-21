import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserUrlsDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsString({ message: 'User ID must be a string' })
  id: string;
}
