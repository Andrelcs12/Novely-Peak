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
    const result = await this.spotifyService.callback(
      code,
      state,
    );

    return reply.redirect(result.redirect);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@Req() req: any) {
    return this.spotifyService.getMySpotify(
      req.user.id,
    );
  }
}