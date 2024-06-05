import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import HttpResponse from 'src/core/http/http-response';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';

@ApiTags(SwaggerTag.USER)
@ApiCommonErrorResponseTemplate()
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입은 유저를 생성하는 것이므로 POST 응답인 201 리턴함.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponseTemplate({ description: '생성한 유저 인덱스 리턴' })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.CONFLICT,
      errorFormatList: [
        HttpErrorConstants.EXIST_EMAIL,
        HttpErrorConstants.EXIST_NICKNAME,
      ],
    },
  ])
  @Post()
  async createUser(@Res() res, @Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return HttpResponse.created(res, { body: user.idx });
  }
}
