import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { supabase } from './supabase';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) return false;

    req.user = data.user;
    return true;
  }
}