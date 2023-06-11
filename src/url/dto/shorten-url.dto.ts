import { IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl({}, { message: 'Invalid URL' })
  longUrl: string;
}
