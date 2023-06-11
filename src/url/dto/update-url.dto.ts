import { PartialType } from '@nestjs/mapped-types';
import { ShortenUrlDto } from './shorten-url.dto';

export class UpdateUrlDto extends PartialType(ShortenUrlDto) {}
