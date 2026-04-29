import { Controller, Patch, UseGuards, Req, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { CompleteOnboardingDto } from "./dto/user.dto";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch("onboarding-intro")
  async completeOnboardingIntro(@Req() req: any) {
    return this.userService.completeOnboardingIntro(req.user.id);
  }

  @Patch("onboarding")
  async completeOnboarding(@Req() req: any, @Body() body: CompleteOnboardingDto) {
    return this.userService.completeOnboarding(req.user.id, body);
  }
}