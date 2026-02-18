import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        gameSessions: {
          select: {
            id: true,
            difficulty: true,
            score: true,
            accuracy: true,
            timeTaken: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getAllSessions() {
    return this.prisma.gameSession.findMany({
      include: {
        user: {
          select: { username: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalSessions = await this.prisma.gameSession.count();
    const avgScore = await this.prisma.gameSession.aggregate({
      _avg: { score: true },
    });
    const topScores = await this.prisma.gameSession.findMany({
      where: { score: { not: null } },
      orderBy: { score: 'desc' },
      take: 5,
      include: { user: { select: { username: true } } },
    });

    return {
      totalUsers,
      totalSessions,
      averageScore: avgScore._avg.score || 0,
      topScores,
    };
  }
}