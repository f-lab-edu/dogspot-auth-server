import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

function isLocalhost() {
  const currentURL = process.env.CURRENT_URL || 'http://localhost'; // 실제 환경에 맞게 URL을 설정해야 합니다.
  return currentURL.includes('localhost');
}

/**
 * 스웨거 설정 파일
 */
const swaggerConfigBuilder = new DocumentBuilder()
  .setTitle('Dog Spot Rest API')
  .setDescription('Swagger API description') //todo: api-readme 작성하기
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    },
    'accessToken',
  );

if (!isLocalhost()) {
  swaggerConfigBuilder.addServer('https://dogspot.site/auth');
}

export const swaggerConfig = swaggerConfigBuilder.build();

export const initSwagger = async (app: INestApplication) => {
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument, swaggerOptions);
};

// swagger 옵션 설정
export const swaggerOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    defaultModelsExpandDepth: 1, // -1 이면 페이지 하단에 dtos 목록 표시 안함 (기본값도 표시 X)
    docExpansion: 'none', // 페이지 접속시 자동 상세보기 off
    persistAuthorization: true, // 페이지 새로고침해도 토큰유지
    tagsSorter: 'alpha', // 태그 정렬
    operationsSorter: 'alpha', // 태그 내 함수 순서. 'alpha':abc순, 'method': HTTP method별 분류
    displayRequestDuration: true, // http request 시간 표시
    showCommonExtensions: true,
    showExtensions: true,
  },
};
