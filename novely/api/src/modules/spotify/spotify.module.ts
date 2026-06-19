import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { PrismaService } from '@/prisma.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService, PrismaService, AuthService],
})
export class SpotifyModule {}
