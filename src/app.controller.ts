import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { UrlService } from './url/url.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateQrcodeDto } from './url/dto/create-qrcode.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('App')
@Public()
// override rate limit for this endpoint
@SkipThrottle()
@Controller()
export class AppController {
  constructor(private appService: AppService, private urlService: UrlService) {}

  @Get()
  getHello(): string {
    return this.appService.getHealth();
  }

  @Get('api/:shortUrlId(*)')
  async redirect(
    @Res() res,
    @Param() { shortUrlId }: CreateQrcodeDto,
  ): Promise<any> {
    const longUrl = await this.urlService.redirect(shortUrlId);

    if (!longUrl) {
      throw new NotFoundException('Resource not found');
    }

    res.redirect(longUrl);
  }
}
