import { Injectable, NotFoundException } from "@nestjs/common";
import { CompleteOnboardingDto } from "./dto/user.dto";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


  async completeOnboardingIntro(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException("Usuário não encontrado");
  }

  if (user.onboardingIntroDone) return user;

  return this.prisma.user.update({
    where: { id: userId },
    data: { onboardingIntroDone: true },
  });
}


  async completeOnboarding(userId: string, data: CompleteOnboardingDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundException("Usuário não encontrado");
  }

  if (user.onboardingDone) return user;

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      goal: data.goal,
      workStyle: data.workStyle,
      discipline: data.discipline,
      onboardingIntroDone: true,
      onboardingDone: true,
      onboardingCompletedAt: new Date(),
    },
  });
}


}