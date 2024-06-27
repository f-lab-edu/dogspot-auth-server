import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponseDto<T> {
  data: T;
  @ApiProperty({
    default: 201,
  })
  status: number;
  @ApiProperty({
    default: 'CREATED',
  })
  message: string;
}
