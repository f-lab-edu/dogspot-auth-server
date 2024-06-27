import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { SocialMethodType } from 'src/domains/auth/helpers/constants';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async existByEmail(email: string): Promise<boolean> {
    const existEmail = await this.exist({
      where: {
        email,
      },
    });
    return existEmail;
  }

  async existByNickname(nickname: string): Promise<boolean> {
    const existNickname = await this.exist({
      where: {
        nickname,
      },
    });
    return existNickname;
  }

  async findByUserIdx(userIdx: number): Promise<User> {
    const user = await this.findOne({
      where: {
        idx: userIdx,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async updatePasswordByUserIdx(userIdx: number, newPassword: string) {
    await this.update({ idx: userIdx }, { password: newPassword });
  }

  async findByEmailAndLoginMethod(email: string, socialType: SocialMethodType) {
    return await this.findOne({
      where: {
        email: email,
        loginMethod: socialType,
      },
    });
  }
}
