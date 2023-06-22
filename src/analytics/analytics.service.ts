import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { PrismaService } from 'src/prisma.service';
import { QueueService } from './queue.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(forwardRef(() => QueueService))
    private queueService: QueueService,
    private readonly prisma: PrismaService,
  ) {}

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

    const analytics = await this.prisma.analytics.upsert({
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

    console.log(`Analytics saved for ${analytics.shortUrlId}`, analytics);
  }
}
