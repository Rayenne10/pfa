import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ServiceUnavailableException } from '@nestjs/common';
describe('unconfigured account recovery', () => {
  const auth = new AuthService({} as JwtService);
  it('does not expose a reset token for another user', async () => {
    await expect(auth.requestReset('someone@example.test')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
  it('does not accept an access token as a reset or verification token', async () => {
    await expect(auth.resetPassword('token', 'newpassword')).rejects.toBeInstanceOf(ServiceUnavailableException);
    await expect(auth.verifyEmail('token')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
