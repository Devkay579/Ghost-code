import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // from JwtStrategy

    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    // Fetch user from DB to check isAdmin
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser || !dbUser.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}