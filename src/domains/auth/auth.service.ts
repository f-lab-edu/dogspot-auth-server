import { UserService } from './../user/user.service';
import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dtos/login-response.dto';
import { detectPlatform } from './../../utils/client.utils';
import { RefTokenRepository } from './repositories/ref-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refTokenRepository: RefTokenRepository,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private logger = new Logger('Auth');

  /**
   * 로그인
   * @param loginUserDto
   * @returns JwtToken
   */
  async login(userAgent: string, dto: LoginUserDto): Promise<LoginResponseDto> {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`login platform: ${platform}`);

    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      // 유저가 존재하지 않는 경우에는 NotFoundException 던져주는 것이 일반적이나, 로그인에서만 예외적으로 이메일, 비밀번호 중 어떤 정보가 잘못 됐는지 확인하지 못하게 하기 위하여 UnauthorizedException로 통일함.
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }

    await validatePassword(password, user.password);

    const accessToken = await this.generateAccessToken(user.idx, platform);
    const refreshToken = await this.generateRefreshToken(user.idx, platform);

    await this.refTokenRepository.createOrUpdateRefToken(
      user.idx,
      platform,
      refreshToken,
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      idx: user.idx,
      profilePath: user.profilePath,
      nickname: user.nickname,
    };
  }

  async generateAccessToken(
    userIdx: number,
    platform: string,
  ): Promise<string> {
    const payload = { userIdx: userIdx, OS: platform };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '2h',
    });
  }

  async generateRefreshToken(
    userIdx: number,
    platform: string,
  ): Promise<string> {
    const payload = { userIdx: userIdx, OS: platform };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '14 days',
    });
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 재생성
   * @param refreshToken 리프레시토큰
   * @returns 새로운 액세스 토큰
   */
  async getNewAccessToken(userAgent: string, refToken: string) {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`getNewAccessToken platform: ${platform}`);

    // 1. 요청으로 받은 리프레시 토큰이 DB에 존재하는지 확인
    const refTokenEntity = await this.refTokenRepository.findOne({
      where: {
        refToken,
      },
    });
    if (!refTokenEntity) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_TOKEN);
    }

    // 2. 리프레시 토큰 만료기간 검증
    const refreshTokenMatches = await this.jwtService.verify(refToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_REFRESH_TOKEN);
    }

    // 3. 액세스토큰 재생성
    const accessToken = await this.generateAccessToken(
      refTokenEntity.userIdx,
      platform,
    );

    return {
      accessToken,
    };
  }

  // 로그아웃시 userIdx와 플랫폼에 해당하는 refToken과 fbtoken 값을 각각의 테이블에서 null로 업데이트
  async logout(userAgent: string, userIdx: number) {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`logout platform: ${platform}`);

    await this.refTokenRepository.update(
      { userIdx, platform },
      { refToken: null },
    );
  }
}
