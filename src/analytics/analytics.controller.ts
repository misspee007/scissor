import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import CustomRequest from 'src/custom.interface';
import { AnalyticsService } from './analytics.service';
import { GetAnalyticsDto } from './dto/analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  getUserAnalytics(
    @Query() { skip, take, cursor, where, orderBy }: GetAnalyticsDto,
    @Req() req: CustomRequest,
  ) {
    const parsedSkip = parseInt(skip, 10);
    const parsedTake = parseInt(take, 10);

    return this.analyticsService.getUserAnalytics(
      {
        skip: parsedSkip,
        take: parsedTake,
        cursor,
        where,
        orderBy,
      },
      req.user.sub,
    );
  }
}
