import responseJson from './response-json';
import status from 'http-status-codes';
import { Response } from 'express';
/**
 * HTTP 응답 클래스
 * - 컨트롤러 함수에서 리턴을 하면 응답 데이터 형식에 맞게 응답한다.
 *
 * @see TransformationInterceptor
 */

export default class HttpResponse {
  static ok<T>(res: Response, body?: T): Response<unknown> {
    return res.status(status.OK).json(responseJson(status.OK, body));
  }

  static created<T>(
    res: Response,
    params?: { uri?: string; body?: T },
  ): Response<unknown> {
    if (params && params.uri) {
      res.setHeader('Location', params.uri);
    }
    return res
      .status(status.CREATED)
      .json(responseJson(status.CREATED, params ? params.body : undefined));
  }

  static noContent(res: Response): Response<unknown> {
    return res.status(status.OK).json();
  }

  static badRequest<T>(res: Response, object?: T | Error): Response<unknown> {
    return res
      .status(status.BAD_REQUEST)
      .json(responseJson(status.BAD_REQUEST, object));
  }

  static unauthorized<T>(res: Response, object?: T | Error): Response<unknown> {
    return res
      .status(status.UNAUTHORIZED)
      .json(responseJson(status.UNAUTHORIZED, object));
  }

  static notFound<T>(res: Response, object?: T | Error): Response<unknown> {
    return res
      .status(status.NOT_FOUND)
      .json(responseJson(status.NOT_FOUND, object));
  }

  static unprocessableEntity<T>(
    res: Response,
    object?: T | Error,
  ): Response<unknown> {
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json(responseJson(status.UNPROCESSABLE_ENTITY, object));
  }

  static internalServerError<T>(
    res: Response,
    object?: T | Error,
  ): Response<unknown> {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(responseJson(status.INTERNAL_SERVER_ERROR, object));
  }
}
