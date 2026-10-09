import { Controller, Get, Header } from '@nestjs/common';
import * as client from 'prom-client';

client.collectDefaultMetrics();

@Controller()
export class MetricsController {
  @Get('metrics')
  @Header('Content-Type', client.register.contentType)
  getMetrics() {
    return client.register.metrics();
  }
  @Get('healthz')
  health() { return { status: 'ok' }; }
  @Get('readyz')
  ready() { return { status: 'ready' }; }
}
