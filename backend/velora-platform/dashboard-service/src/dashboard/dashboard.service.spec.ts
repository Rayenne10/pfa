import axios from 'axios';
import { DashboardService } from './dashboard.service';
import { InternalServerErrorException } from '@nestjs/common';
jest.mock('axios');
const get = axios.get as jest.Mock;
describe('Prometheus query failure behavior', () => {
  beforeEach(() => get.mockReset());
  it('bounds upstream wait time and forwards metric results', async () => {
    get.mockResolvedValue({ data: { status: 'success', data: { result: [{ metric: { job: 'auth-service' }, value: [1, '1'] }] } } });
    expect(await new DashboardService().getStatus()).toHaveLength(1);
    expect(get.mock.calls[0][1].timeout).toBe(5000);
  });
  it('reports monitoring failure rather than returning healthy zero values', async () => {
    get.mockRejectedValue(new Error('timeout'));
    await expect(new DashboardService().getAllMetrics()).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
