import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UrlService } from './url/url.service';
import { PrismaModule } from './prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UrlController } from './url/url.controller';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsService } from './analytics/analytics.service';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueService } from './analytics/queue.service';
import { TaskService } from './analytics/task.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      // caching
      ttl: 300000, // 5 minutes
      max: 1000, // maximum number of items in cache
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      // rate limiting
      ttl: 60,
      limit: 10,
    }),
    UrlModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    AnalyticsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [UrlController, AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
    UrlService,
    AnalyticsService,
    QueueService,
    TaskService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
