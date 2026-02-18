import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';
import { StartGameDto } from './dto/start-game.dto';
import { SubmitGameDto } from './dto/submit-game.dto';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('start')
  startGame(@Request() req, @Body() dto: StartGameDto) {
    const userId = req.user.userId;
    return this.gameService.startGame(userId, dto.difficulty);
  }

  @Post('submit')
  submitGame(@Request() req, @Body() dto: SubmitGameDto) {
    const userId = req.user.userId;
    return this.gameService.submitGame(userId, dto);
  }

 @Get('leaderboard')
getLeaderboard() {
  return this.gameService.getLeaderboard();
}
}