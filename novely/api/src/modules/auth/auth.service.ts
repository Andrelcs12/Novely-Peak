import { Injectable } from '@nestjs/common';
import { supabase } from './supabase';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getMe(token: string) {
    const accessToken = token.replace('Bearer ', '');

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new Error('Invalid token');
    }

    const supabaseUser = data.user;

    // procura usuário no banco
    let user = await this.prisma.user.findUnique({
      where: { email: supabaseUser.email! },
    });

    // cria se não existir
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name,
          avatar: supabaseUser.user_metadata?.avatar_url,
          username: supabaseUser.email!.split('@')[0],
        },
      });
    }

    return user;
  }
}