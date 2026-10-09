import { Controller, Get, Header } from '@nestjs/common';
import * as client from 'prom-client';

client.collectDefaultMetrics();

let eventLoopLag: client.Gauge<string>;

const existingMetric = client.register.getSingleMetric(
  'nodejs_eventloop_lag_seconds'
);

if (existingMetric) {
  eventLoopLag = existingMetric as client.Gauge<string>;
} else {
  eventLoopLag = new client.Gauge({
    name: 'nodejs_eventloop_lag_seconds',
    help: 'Event loop lag in seconds',
  });

  setInterval(() => {
    const start = process.hrtime();

    setImmediate(() => {
      const delta = process.hrtime(start);
      const lag = delta[0] + delta[1] / 1e9;
      eventLoopLag.set(lag);
    });
  }, 5000);
}

@Controller()
export class MetricsController {
  @Get('/metrics')
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    return client.register.metrics();
  }
}