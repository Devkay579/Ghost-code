import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const sessions = await this.prisma.gameSession.findMany({
      where: { userId, submittedCode: { not: null } },
    });

    if (sessions.length === 0) {
      return {
        totalGames: 0,
        averageAccuracy: 0,
        highestScore: 0,
        totalScore: 0,
        gamesByDifficulty: { easy: 0, medium: 0, hard: 0 },
      };
    }

    const totalGames = sessions.length;
    const totalAccuracy = sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0);
    const averageAccuracy = totalAccuracy / totalGames;
    const highestScore = Math.max(...sessions.map(s => s.score || 0));
    const totalScore = sessions.reduce((sum, s) => sum + (s.score || 0), 0);

    const gamesByDifficulty = {
      easy: sessions.filter(s => s.difficulty === 'easy').length,
      medium: sessions.filter(s => s.difficulty === 'medium').length,
      hard: sessions.filter(s => s.difficulty === 'hard').length,
    };

    return {
      totalGames,
      averageAccuracy,
      highestScore,
      totalScore,
      gamesByDifficulty,
    };
  }

  async getUserSessions(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      this.prisma.gameSession.findMany({
        where: { userId, submittedCode: { not: null } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.gameSession.count({
        where: { userId, submittedCode: { not: null } },
      }),
    ]);

    return {
      data: sessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}