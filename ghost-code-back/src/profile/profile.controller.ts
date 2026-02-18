import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('stats')
  async getStats(@Request() req) {
    const userId = req.user.userId;
    return this.profileService.getUserStats(userId);
  }

  @Get('sessions')
  async getSessions(
    @Request() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const userId = req.user.userId;
    return this.profileService.getUserSessions(
      userId,
      parseInt(page),
      parseInt(limit),
    );
  }
}