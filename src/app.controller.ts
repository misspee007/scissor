import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { UrlService } from './url/url.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateQrcodeDto } from './url/dto/create-qrcode.dto';

@ApiTags('App')
@Public()
@Controller()
export class AppController {
  constructor(private appService: AppService, private urlService: UrlService) {}

  @Get()
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get('/:shortUrlId')
  async redirect(
    @Res() res,
    @Param() { shortUrlId }: CreateQrcodeDto,
  ): Promise<any> {
    const longUrl = await this.urlService.redirect(shortUrlId);
    return res.redirect(longUrl);
  }
}
