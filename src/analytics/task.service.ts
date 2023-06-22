import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly queueService: QueueService) {}

  @Cron('* * * * *') // Runs every minute
  async handleCron(): Promise<void> {
    await this.queueService.processClickEvents();
  }
}
