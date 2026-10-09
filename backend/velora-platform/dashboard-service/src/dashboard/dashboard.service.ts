import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DashboardService {
  private readonly prometheusBaseUrl =
    process.env.PROMETHEUS_URL || 'http://localhost:9090';

  private async queryPrometheus(query: string) {
    try {
      const response = await axios.get(
        `${this.prometheusBaseUrl}/api/v1/query`,
        {
          params: { query },
        },
      );

      return response.data.data.result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Prometheus query failed: ${query}`,
      );
    }
  }

  async getStatus() {
    return this.queryPrometheus('up');
  }

  async getCpu() {
    return this.queryPrometheus('rate(process_cpu_seconds_total[1m])');
  }

  async getMemory() {
    return this.queryPrometheus('process_resident_memory_bytes');
  }

  async getEventLoopLag() {
    return this.queryPrometheus('nodejs_eventloop_lag_seconds');
  }

  async getAllMetrics() {
    const [status, cpu, memory, lag] = await Promise.all([
      this.getStatus(),
      this.getCpu(),
      this.getMemory(),
      this.getEventLoopLag(),
    ]);

    return {
      status,
      cpu,
      memory,
      lag,
    };
  }
  async getAlerts() {
  try {
    const response = await axios.get(
      `${this.prometheusBaseUrl}/api/v1/alerts`
    );

    return response.data.data.alerts;
  } catch (error) {
    throw new InternalServerErrorException(
      'Prometheus alerts fetch failed',
    );
  }
}
}