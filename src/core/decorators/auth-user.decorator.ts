import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/domains/user/entities/user.entity';
import { log } from 'winston';

const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request: ', request.user);
    return request.user as User;
  },
);

export default AuthUser;
