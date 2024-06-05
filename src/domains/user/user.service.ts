import { ConflictException, Injectable } from '@nestjs/common';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  /**
   *  회원가입
   * @param dto CreateUserDto
   * @returns user
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkExistNickname(dto.nickname);

    const user = User.from(dto);

    return await this.userRepository.save(user);
  }

  /**
   * 닉네임 중복 검사
   * @param dto.nickname 설정할 닉네임
   * @returns boolean
   */
  async checkExistNickname(nickname: string): Promise<boolean> {
    const isExistNickname = await this.userRepository.existByNickname(nickname);

    if (isExistNickname) {
      throw new ConflictException(HttpErrorConstants.EXIST_NICKNAME);
    }

    return isExistNickname;
  }
}
