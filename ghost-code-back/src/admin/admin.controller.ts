import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard) // both guards
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('sessions')
  getSessions() {
    return this.adminService.getAllSessions();
  }

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }
}