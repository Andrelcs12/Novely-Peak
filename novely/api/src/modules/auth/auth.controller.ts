import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  async me(@Req() req: any) {
    return this.authService.getOrCreateUser(req.user);
  }
}