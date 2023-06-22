import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class QueueService {
  private clickEventsQueue: CreateAnalyticsDto[] = [];

  constructor(
    @Inject(forwardRef(() => AnalyticsService))
    private readonly analyticsService: AnalyticsService,
  ) {}

  async enqueueClickEvent(clickEvent: CreateAnalyticsDto): Promise<void> {
    this.clickEventsQueue.push(clickEvent);
  }

  async processClickEvents(): Promise<void> {
    while (this.clickEventsQueue.length > 0) {
      const clickEvent = this.clickEventsQueue.shift();
      // Process the click event
      await this.analyticsService.saveClickEvent(clickEvent);
    }
  }
}
