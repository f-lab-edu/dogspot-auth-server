import winston, { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  //   format: defaultLogFormat,
  transports: [new transports.Console({})],
});
