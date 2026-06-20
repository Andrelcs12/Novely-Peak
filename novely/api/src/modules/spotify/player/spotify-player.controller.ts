import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../auth/auth.guard";
import { SpotifyPlayerService } from "./spotify-player.service";

@Controller("spotify/player")
export class SpotifyPlayerController {
  constructor(private player: SpotifyPlayerService) {}

  @Get("current")
  @UseGuards(AuthGuard)
  current(@Req() req: any) {
    return this.player.getCurrentTrack(req.user.id);
  }

  @Post("play")
  @UseGuards(AuthGuard)
  play(
    @Req() req: any,
    @Body() body: { uris?: string[]; context_uri?: string },
  ) {
    return this.player.play(req.user.id, body);
  }

  @Post("pause")
  @UseGuards(AuthGuard)
  pause(@Req() req: any) {
    return this.player.pause(req.user.id);
  }

  @Post("next")
  @UseGuards(AuthGuard)
  next(@Req() req: any) {
    return this.player.next(req.user.id);
  }

  @Post("previous")
  @UseGuards(AuthGuard)
  previous(@Req() req: any) {
    return this.player.previous(req.user.id);
  }

  // NOVO
  @Put("volume")
  @UseGuards(AuthGuard)
  volume(@Req() req: any, @Body() body: { volume_percent: number }) {
    return this.player.setVolume(req.user.id, body.volume_percent);
  }
}