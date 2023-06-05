import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Invalid URL' })
  url: string;
}
