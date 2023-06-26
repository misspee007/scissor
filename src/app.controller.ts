import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { UrlService } from './url/url.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateQrcodeDto } from './url/dto/create-qrcode.dto';
import { SkipThrottle } from '@nestjs/throttler';
import CustomRequest from './custom.interface';
import { AnalyticsService } from './analytics/analytics.service';

@ApiTags('App')
@Public()
// override rate limit for this endpoint
@SkipThrottle()
@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private urlService: UrlService,
    private analyticsService: AnalyticsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get('api/:shortUrlId(*)')
  async redirect(
    @Res() res,
    @Req() req: CustomRequest,
    @Param() { shortUrlId }: CreateQrcodeDto,
  ): Promise<any> {
    const timestamp = new Date().toISOString();
    const longUrl = await this.urlService.redirect(shortUrlId);
    const userAgent = req.headers['user-agent'];

    if (!longUrl) {
      throw new NotFoundException('Resource not found');
    }

    await this.analyticsService.processClick({
      shortUrlId,
      referer: req.headers.referer,
      userAgent,
      ipAddress: req.ip,
      deviceType: null,
      clickCoordinates: null,
      timestamp,
    });

    res.redirect(longUrl);
  }
}
