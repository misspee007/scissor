import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
