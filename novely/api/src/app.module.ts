import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { LinksModule } from './modules/links/links.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // 🔥 EVENT EMITTER (OBRIGATÓRIO)
    EventEmitterModule.forRoot(),

    // 🔥 RATE LIMIT GLOBAL
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ],
    }),

    AuthModule,
    UserModule,
    TasksModule,
    LinksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}