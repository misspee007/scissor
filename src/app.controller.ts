import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { UrlService } from './url/url.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateQrcodeDto } from './url/dto/create-qrcode.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { AnalyticsService } from './analytics/analytics.service';

@ApiTags('App')
@Public()
@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private urlService: UrlService,
    private analyticsService: AnalyticsService,
  ) {}

  // override rate limit for this endpoint
  @SkipThrottle()
  @Get()
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get(':shortUrlId')
  async redirect(
    @Res() res,
    @Req() req,
    @Param() { shortUrlId }: CreateQrcodeDto,
  ): Promise<any> {
    const longUrl = await this.urlService.redirect(shortUrlId);

    // record the click and referer
    await this.analyticsService.processClick(shortUrlId, req.headers.referer);

    return res.redirect(longUrl);
  }
}
