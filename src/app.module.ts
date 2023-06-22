import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UrlService } from './url/url.service';
import { PrismaModule } from './prisma.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UrlController } from './url/url.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    UrlModule,
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [UrlController, AppController],
  providers: [
    AppService,
    UrlService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      // rate limiting
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
