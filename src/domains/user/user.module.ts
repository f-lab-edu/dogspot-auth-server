import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmExModule],
})
export class UserModule {}
