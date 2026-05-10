import { Controller, Patch, UseGuards, Req, Body, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard";
import { CompleteOnboardingDto, UpdateProfileDto } from "./dto/user.dto";

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


  @Get("profile")
  async getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch("profile")
  async updateProfile(
    @Req() req: any,
    @Body() body: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(
      req.user.id,
      body,
    );
  }


}