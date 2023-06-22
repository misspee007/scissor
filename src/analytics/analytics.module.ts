import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from 'src/prisma.module';
import { TaskService } from './task.service';
import { QueueService } from './queue.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [PrismaModule],
  providers: [AnalyticsService, QueueService, TaskService],
  exports: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
