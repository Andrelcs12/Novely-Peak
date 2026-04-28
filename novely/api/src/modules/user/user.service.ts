import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CompleteOnboardingDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ✅ INTRO (primeira etapa)
  async completeOnboardingIntro(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // evita repetir
    if (user.onboardingIntroDone) {
      throw new BadRequestException("Onboarding intro já concluído");
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingIntroDone: true,
      },
    });
  }

  // ✅ FORMULÁRIO (principal)
  async completeOnboarding(
    userId: string,
    data: CompleteOnboardingDto
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    // 🔒 regra de produto (MVP)
    if (user.onboardingDone) {
      throw new BadRequestException("Onboarding já foi concluído");
    }

    // 🔒 regra: não pode pular intro
    if (!user.onboardingIntroDone) {
      throw new BadRequestException(
        "Finalize o onboarding inicial antes"
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        goal: data.goal,
        workStyle: data.workStyle,
        discipline: data.discipline,
        onboardingDone: true,
        onboardingCompletedAt: new Date(), // opcional mas recomendado
      },
    });
  }
}