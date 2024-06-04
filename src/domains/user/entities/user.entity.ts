import BaseEntity from 'src/core/entity/base.entity';
import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity } from 'typeorm';
import { SocialMethodType } from 'src/domains/auth/helpers/constants';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 64,
  })
  email: string;

  @Column({
    nullable: false,
    length: 64,
  })
  password: string;

  @Column({
    nullable: false,
    length: 32,
  })
  nickname: string;

  @Column({
    nullable: true,
    default: null,
  })
  profilePath: string;

  @Column({
    nullable: true,
    default: 0,
  })
  agreeWithMarketing: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  loginMethod: SocialMethodType;

  @Column({
    nullable: true,
    default: null,
  })
  refreshToken: string;

  static from({
    email,
    password,
    nickname,
    profilePath,
    agreeWithMarketing,
    loginMethod,
  }: {
    email: string;
    password: string;
    nickname: string;
    profilePath: string;
    agreeWithMarketing: boolean;
    loginMethod: SocialMethodType;
  }) {
    const user = new User();
    user.email = email;
    user.password = hashPassword(password);
    user.nickname = nickname;
    user.profilePath = profilePath;
    user.agreeWithMarketing = agreeWithMarketing;
    user.loginMethod = loginMethod;
    return user;
  }
}
