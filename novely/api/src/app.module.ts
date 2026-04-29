import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // 🔥 RATE LIMIT GLOBAL (CORRIGIDO)
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 60 segundos (em ms)
          limit: 20,  // 20 requests por IP
        },
      ],
    }),
    
    AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
