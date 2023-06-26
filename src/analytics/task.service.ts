import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly queueService: QueueService) {}

  @Cron('*/2 * * * *') // every 2 minutes
  async handleCron(): Promise<void> {
    await this.queueService.processClickEvents();
  }
}
