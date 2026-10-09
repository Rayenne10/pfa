import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';

export function isInternal(header: unknown): boolean {
  const secret = process.env.INTERNAL_API_TOKEN;
  if (!secret || secret.length < 32 || typeof header !== 'string') return false;
  const a = Buffer.from(header); const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
@Injectable()
export class InternalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!isInternal(context.switchToHttp().getRequest().headers['x-internal-token']))
      throw new UnauthorizedException();
    return true;
  }
}
