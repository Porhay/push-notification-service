import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AccessUserGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = request.params.userId;
    if (user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to access this user',
      );
    }

    return true;
  }
}
