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
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.metadata?.full_name ?? null,
          avatar: user.metadata?.avatar_url ?? null,
          username: user.email.split("@")[0],
        },
      });
    }

    return dbUser;
  }
}