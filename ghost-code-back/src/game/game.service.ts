import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitGameDto } from './dto/submit-game.dto';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  // Generate random alphanumeric code based on difficulty
  generateCode(difficulty: string): string {
    const length =
      difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Calculate score (simplified version – you can expand later)
  calculateScore(params: {
    difficulty: string;
    accuracy: number;
    timeTaken: number;
    maxTime: number; // e.g., 60 seconds for easy, 90 for medium, 120 for hard
  }): number {
    const { difficulty, accuracy, timeTaken, maxTime } = params;
    const baseScore =
      difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300;
    const timeBonus = Math.max(0, maxTime - timeTaken) * 2;
    const accuracyMultiplier = accuracy / 100;
    return Math.round((baseScore + timeBonus) * accuracyMultiplier);
  }

  // Start a new game session
  async startGame(userId: string, difficulty: string) {
    const code = this.generateCode(difficulty);
    const game = await this.prisma.gameSession.create({
      data: {
        userId,
        difficulty,
        generatedCode: code,
      },
    });
    // Return only necessary info – never send the code back after creation? Actually we need it for memory phase.
    // But we should return it only at start, and later validate on server.
    return {
      gameId: game.id,
      difficulty: game.difficulty,
      // Do NOT include generatedCode in response? But frontend needs it to show.
      // For security, we could send it encrypted or rely on HTTPS. For now, send it.
      // However, to prevent cheating, we might want to store it server-side and never expose after memory phase.
      // But the memory phase requires the user to see it. So it's fine to send once.
      code: game.generatedCode,
    };
  }

  // Submit and validate
  async submitGame(userId: string, dto: SubmitGameDto) {
    const game = await this.prisma.gameSession.findUnique({
      where: { id: dto.gameId },
    });
    if (!game) {
      throw new BadRequestException('Game session not found');
    }
    if (game.userId !== userId) {
      throw new BadRequestException('Not your game');
    }
    if (game.submittedCode) {
      throw new BadRequestException('Game already submitted');
    }

    // Calculate accuracy (percentage of matching characters in correct position)
    const generated = game.generatedCode;
    const submitted = dto.submittedCode.toUpperCase();
    let matches = 0;
    const len = Math.min(generated.length, submitted.length);
    for (let i = 0; i < len; i++) {
      if (generated[i] === submitted[i]) matches++;
    }
    const accuracy = (matches / generated.length) * 100;

    // Determine max allowed time per difficulty
    const maxTime =
      game.difficulty === 'easy' ? 60 : game.difficulty === 'medium' ? 90 : 120;
    const score = this.calculateScore({
      difficulty: game.difficulty,
      accuracy,
      timeTaken: dto.timeTaken,
      maxTime,
    });

    // Update game session
    const updated = await this.prisma.gameSession.update({
      where: { id: dto.gameId },
      data: {
        submittedCode: dto.submittedCode,
        accuracy,
        score,
        timeTaken: dto.timeTaken,
      },
    });

    return {
      accuracy,
      score,
      correctCode: game.generatedCode, // for feedback
    };
  }

  async getLeaderboard() {
  return this.prisma.gameSession.findMany({
    where: { submittedCode: { not: null } },
    orderBy: { score: 'desc' },
    take: 20,
    include: {
      user: {
        select: { username: true },
      },
    },
  });
}
}