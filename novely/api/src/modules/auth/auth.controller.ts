import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  async me(@Req() req: any) {
    return this.authService.getMe(req.headers.authorization);
  }
}