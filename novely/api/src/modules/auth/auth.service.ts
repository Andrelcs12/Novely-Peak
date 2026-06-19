import { Injectable } from "@nestjs/common"; // ajuste o caminho pro seu output do prisma
import { PrismaService } from "@/prisma.service";
import { Prisma } from "../../../generated/prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateUser(user: {
    id: string;
    email: string;
    metadata?: any;
  }) {
    // 1. já existe pelo id (caso normal)
    let dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (dbUser) return dbUser;

    // 2. já existe pelo email (corrida entre requests simultâneas,
    // ou usuário criado antes por outro fluxo)
    dbUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (dbUser) return dbUser;

    // 3. gera username único
    const baseUsername = user.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    const existingUsername = await this.prisma.user.findFirst({
      where: { username: baseUsername },
    });

    const username = existingUsername
      ? `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`
      : baseUsername;

    try {
      dbUser = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.metadata?.full_name ?? user.metadata?.name ?? null,
          avatar: user.metadata?.avatar_url ?? user.metadata?.picture ?? null,
          username,
        },
      });
    } catch (err) {
      // 4. se outra request venceu a corrida nesse meio tempo,
      // não estoura erro: busca quem já foi criado e retorna.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        dbUser = await this.prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) return dbUser;
      }
      throw err;
    }

    return dbUser;
  }
}