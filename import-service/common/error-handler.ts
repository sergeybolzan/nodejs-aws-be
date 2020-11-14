import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy';
import {StatusCodes, ReasonPhrases} from 'http-status-codes';
import {createResponse} from '../utils/create-response';

export const errorHandler = (func: Function) => async (event?: APIGatewayProxyEvent) => {
  try {
    return await func(event);
  } catch (e) {
    return e.statusCode
      ? createResponse(e.statusCode, e.message)
      : createResponse(StatusCodes.INTERNAL_SERVER_ERROR, e.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
