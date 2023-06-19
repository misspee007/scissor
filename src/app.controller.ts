import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(private appService: AppService, private urlService: UrlService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get(':shortUrlId')
  async redirect(@Res() res, @Param('shortUrlId') id: string): Promise<any> {
    const longUrl = await this.urlService.redirect(id);
    return res.redirect(longUrl);
  }
}
