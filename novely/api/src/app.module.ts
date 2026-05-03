import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { GoalsModule } from './modules/goals/goals.module';
import { StreakModule } from './modules/streak/streak.module';
import { StreakEventsModule } from './modules/streak-events/streak-events.module';
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
    GoalsModule,
    StreakModule,
    StreakEventsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}