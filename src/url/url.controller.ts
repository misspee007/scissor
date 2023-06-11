import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import CustomRequest from 'src/custom.interface';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(@Body() shortenUrlDto: ShortenUrlDto, @Req() req: CustomRequest) {
    return this.urlService.shortenUrl(shortenUrlDto, req.user.sub);
  }

  // @Get()
  // findAll() {
  //   return this.urlService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.urlService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
  //   return this.urlService.update(+id, updateUrlDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.urlService.remove(+id);
  // }
}
