import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/analytics.dto';
import { PrismaService } from '../prisma.service';
import { QueueService } from './queue.service';
import { Analytics, Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(forwardRef(() => QueueService))
    private queueService: QueueService,
    private readonly prisma: PrismaService,
  ) {}

  async getUserAnalytics(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.AnalyticsWhereUniqueInput;
      where?: Prisma.AnalyticsWhereInput;
      orderBy?: Prisma.AnalyticsOrderByWithRelationInput;
    },
    userId: number,
  ): Promise<{ analytics: Analytics[]; count: number }> {
    const { skip, take, cursor, where, orderBy } = params;

    const parsedSkip = Number.isInteger(skip) ? skip : undefined;
    const parsedTake = Number.isInteger(take) ? take : undefined;

    // Get the analytics for the user
    const [analytics, count] = await Promise.all([
      this.prisma.analytics.findMany({
        skip: parsedSkip,
        take: parsedTake,
        cursor,
        where: {
          url: {
            userId,
          },
          // OTHER FILTERS
          ...where,
        },
        orderBy,

        include: {
          clickEvents: {
            select: {
              id: true,
              referer: true,
              userAgent: true,
              ipAddress: true,
              deviceType: true,
              clickCoordinates: true,
              timestamp: true,
            },
            orderBy: {
              timestamp: 'desc',
            },
            take: 20,
          },
        },
      }),
      this.prisma.analytics.count({
        where: {
          url: {
            userId,
          },
          // OTHER FILTERS
          ...where,
        },
      }),
    ]);

    return { analytics, count };
  }

  async processClick({
    shortUrlId,
    referer,
    userAgent,
    ipAddress,
    deviceType,
    clickCoordinates,
  }: CreateAnalyticsDto): Promise<void> {
    const clickEvent: CreateAnalyticsDto = {
      shortUrlId,
      referer,
      userAgent,
      ipAddress,
      deviceType,
      clickCoordinates,
      timestamp: new Date().toISOString(),
    };

    // Add the click event to the queue
    await this.queueService.enqueueClickEvent(clickEvent);
  }

  async saveClickEvent(clickEvent: CreateAnalyticsDto): Promise<void> {
    // Save the click event to the database
    const {
      shortUrlId,
      referer,
      userAgent,
      ipAddress,
      deviceType,
      clickCoordinates,
      timestamp,
    } = clickEvent;

    await this.prisma.analytics.upsert({
      where: {
        shortUrlId,
      },
      create: {
        shortUrlId,
        clickEvents: {
          create: [
            {
              referer,
              userAgent,
              ipAddress,
              deviceType,
              clickCoordinates,
              timestamp,
            },
          ],
        },
        clicks: 1,
      },
      update: {
        clickEvents: {
          create: [
            {
              referer,
              userAgent,
              ipAddress,
              deviceType,
              clickCoordinates,
              timestamp,
            },
          ],
        },
        clicks: {
          increment: 1,
        },
      },
    });
  }
}
