import {
  Controller,
  Patch,
  UseGuards,
  Req,
  Body,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/auth.guard"; // ajuste se necessário
import { CompleteOnboardingDto } from "./dto/complete-onboarding.dto";

@Controller("user")
@UseGuards(AuthGuard) // 🔒 protege TODAS rotas
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ onboarding de leitura (intro)
  @Patch("onboarding-intro")
  async completeOnboardingIntro(@Req() req: any) {
    const userId = req.user.id;

    return this.userService.completeOnboardingIntro(userId);
  }

  // ✅ onboarding de formulário
  @Patch("onboarding")
  async completeOnboarding(
    @Req() req: any,
    @Body() body: CompleteOnboardingDto
  ) {
    const userId = req.user.id;

    return this.userService.completeOnboarding(userId, body);
  }
}