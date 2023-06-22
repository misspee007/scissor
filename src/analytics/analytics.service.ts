import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/analytics.dto';
import { PrismaService } from 'src/prisma.service';
import { QueueService } from './queue.service';
import { Prisma } from '@prisma/client';

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
  ): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;

    const parsedSkip = Number.isInteger(skip) ? skip : undefined;
    const parsedTake = Number.isInteger(take) ? take : undefined;

    // Get the analytics for the user
    return this.prisma.analytics.findMany({
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
            referer: true,
            timestamp: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
          take: 20,
        },
      },
    });
  }

  async processClick(shortUrlId: string, referer: string): Promise<void> {
    const clickEvent: CreateAnalyticsDto = {
      shortUrlId,
      referer,
      timestamp: new Date().toISOString(),
    };

    // Add the click event to the queue
    await this.queueService.enqueueClickEvent(clickEvent);
  }

  async saveClickEvent(clickEvent: CreateAnalyticsDto): Promise<void> {
    // Save the click event to the database
    const { shortUrlId, referer, timestamp } = clickEvent;

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
