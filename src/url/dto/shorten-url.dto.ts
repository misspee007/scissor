import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @ApiProperty({
    description: 'URL to shorten',
    example: 'https://www.google.com',
  })
  @IsUrl({}, { message: 'Invalid URL' })
  longUrl: string;
}
