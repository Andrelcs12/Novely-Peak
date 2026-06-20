import { Module } from "@nestjs/common";
import { SpotifyService } from "./spotify.service";
import { SpotifyController } from "./spotify.controller";
import { SpotifyPlayerController } from "./player/spotify-player.controller";
import { SpotifyPlayerService } from "./player/spotify-player.service";
import { PrismaService } from "@/prisma.service";
import { AuthService } from "../auth/auth.service";

@Module({
  controllers: [
    SpotifyController,
    SpotifyPlayerController, // <-- ESSENCIAL
  ],
  providers: [
    SpotifyService,
    SpotifyPlayerService, // <-- ESSENCIAL
    PrismaService,
    AuthService,
  ],
})
export class SpotifyModule {}