import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getAllMetrics() {
    return this.dashboardService.getAllMetrics();
  }

  @Get('status')
  async getStatus() {
    return this.dashboardService.getStatus();
  }

  @Get('cpu')
  async getCpu() {
    return this.dashboardService.getCpu();
  }

  @Get('memory')
  async getMemory() {
    return this.dashboardService.getMemory();
  }

  @Get('lag')
  async getLag() {
    return this.dashboardService.getEventLoopLag();
  }
  @Get('alerts')
getAlerts() {
  return this.dashboardService.getAlerts();
}
@Get('cpu-test')
cpuTest() {
  const end = Date.now() + 60000; // 60 secondes
  while (Date.now() < end) {}
  return "CPU stress done";
}
}