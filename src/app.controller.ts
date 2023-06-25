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

    const {
      referer,
      userAgent,
      ipAddress,
      deviceType,
      clickCoordinates,
      timestamp,
    } = req.headers;

    // record the click and referer
    await this.analyticsService.processClick({
      shortUrlId,
      referer,
      userAgent,
      ipAddress,
      deviceType,
      clickCoordinates,
      timestamp,
    });

    return res.redirect(longUrl);
  }
}
