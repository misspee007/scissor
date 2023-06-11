import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { PrismaModule } from 'src/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
