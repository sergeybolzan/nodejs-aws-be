import {StatusCodes, ReasonPhrases} from 'http-status-codes';
import {createResponse} from '../utils/create-response';

export const errorHandler = (func: Function) => async (...params) => {
  try {
    return await func(...params);
  } catch (e) {
    return e.statusCode
      ? createResponse(e.statusCode, e.message)
      : createResponse(StatusCodes.INTERNAL_SERVER_ERROR, e.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
