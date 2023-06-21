import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import CustomRequest from 'src/custom.interface';
import { UserService } from 'src/users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUserUrlsDto } from './dto/get-urls.dto';

@ApiTags('URL')
@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly userService: UserService,
  ) {}

  @Post()
  shortenUrl(@Body() shortenUrlDto: ShortenUrlDto, @Req() req: CustomRequest) {
    return this.urlService.shortenUrl(shortenUrlDto, req.user.sub);
  }

  @Post('/qrcode/:shortUrlId')
  createQrCode(@Param() { shortUrlId }: CreateQrcodeDto) {
    return this.urlService.createQrCode(shortUrlId);
  }

  @Get('/user/:userId')
  getUserUrls(@Param() { id }: GetUserUrlsDto) {
    const userId = parseInt(id, 10);
    return this.userService.getUserUrls(userId);
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
