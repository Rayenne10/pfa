import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isInternal } from './internal.guard';
@Injectable()
export class UserUpdateGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (isInternal(req.headers['x-internal-token'])) { req.internal = true; return true; }
    return super.canActivate(context);
  }
}
