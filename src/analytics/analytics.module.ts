import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from 'src/prisma.module';
import { TaskService } from './task.service';
import { QueueService } from './queue.service';

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsService, QueueService, TaskService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
