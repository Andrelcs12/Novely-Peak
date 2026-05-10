import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateUser(user: {
    id: string;
    email: string;
    metadata?: any;
  }) {
    let dbUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // 🔥 base username
      const baseUsername = user.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");

      // 🔥 verifica se já existe
      const existingUsername =
        await this.prisma.user.findFirst({
          where: {
            username: baseUsername,
          },
        });

      // 🔥 evita conflito
      const username = existingUsername
        ? `${baseUsername}_${Math.floor(
            1000 + Math.random() * 9000
          )}`
        : baseUsername;

      dbUser = await this.prisma.user.create({
        data: {
          id: user.id,

          email: user.email,

          name:
            user.metadata?.full_name ??
            user.metadata?.name ??
            null,

          avatar:
            user.metadata?.avatar_url ??
            user.metadata?.picture ??
            null,

          username,
        },
      });

      // 🔥 cria streak automaticamente
      await this.prisma.streak.create({
        data: {
          userId: dbUser.id,
        },
      });
    }

    return dbUser;
  }
}