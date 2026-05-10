import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/prisma.service';
import { GoalsService } from '../goals/goals.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, GoalsService],
})
export class UserModule {}
