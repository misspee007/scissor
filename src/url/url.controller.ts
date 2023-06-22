import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  Delete,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import CustomRequest from 'src/custom.interface';
import { ApiTags } from '@nestjs/swagger';
import { GetUserUrlsDto, GetAllUrlsDto, GetUrlDto } from './dto/get-urls.dto';

@ApiTags('URL')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @Req() req: CustomRequest) {
    return this.urlService.shortenUrl(shortenUrlDto, req.user.sub);
  }

  @Post('qrcode/:shortUrlId')
  createQrCode(@Param() { shortUrlId }: CreateQrcodeDto) {
    return this.urlService.createQrCode(shortUrlId);
  }

  @Get('user/:userId')
  getUserUrls(@Param() { userId }: GetUserUrlsDto) {
    const parsedUserId = parseInt(userId, 10);
    return this.urlService.getUrlHistory(parsedUserId);
  }

  @Get(':shortUrlId')
  findOne(@Param() { shortUrlId }: GetUrlDto) {
    return this.urlService.getUrl(shortUrlId);
  }

  @Delete(':shortUrlId')
  remove(@Param() { shortUrlId }: GetUrlDto) {
    return this.urlService.deleteUrl({ shortUrlId });
  }

  @Get()
  findAll(@Query() { skip, take, cursor, where, orderBy }: GetAllUrlsDto) {
    const parsedSkip = parseInt(skip, 10);
    const parsedTake = parseInt(take, 10);
    return this.urlService.getAllUrls({
      skip: parsedSkip,
      take: parsedTake,
      cursor,
      where,
      orderBy,
    });
  }
}
