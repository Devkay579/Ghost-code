import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { AdminModule } from './admin/admin.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [AuthModule, PrismaModule, GameModule, AdminModule],
  controllers: [AppController, ProfileController],
  providers: [AppService, ProfileService],
})
export class AppModule {}
