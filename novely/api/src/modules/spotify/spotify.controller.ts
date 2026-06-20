import { Controller, Get, Query, Res, Req, UseGuards } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { AuthGuard } from "../auth/auth.guard";
import { SpotifyService } from "./spotify.service";

@Controller("spotify")
export class SpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService
  ) {}

  @Get("login")
  @UseGuards(AuthGuard)
  login(@Req() req: any) {
    return this.spotifyService.login(req.user.id);
  }

  @Get("callback")
  async callback(
    @Query("code") code: string,
    @Query("state") state: string,
    @Res() reply: FastifyReply,
  ) {
    try {
      const result = await this.spotifyService.callback(code, state);
      return reply.redirect(result.redirect);
    } catch (e) {
      return reply.redirect(`${process.env.FRONTEND_URL}/music?error=spotify`);
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() req: any) {
    return this.spotifyService.getMySpotify(
      req.user.id,
    );
  }

  @Get("profile")
@UseGuards(AuthGuard)
profile(@Req() req: any) {
  return this.spotifyService.getProfile(req.user.id);
}

@Get("profile/extended")
@UseGuards(AuthGuard)
extended(@Req() req: any) {
  return this.spotifyService.getExtendedProfile(req.user.id);
}
  // NOVO
  @Get("playlists")
  @UseGuards(AuthGuard)
  playlists(@Req() req: any) {
    return this.spotifyService.getPlaylists(req.user.id);
  }
}