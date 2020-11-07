import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import {createResponse} from "../utils/create-response";

export const errorHandler = (func: Function) => async (event?: APIGatewayProxyEvent) => {
  try {
    return await func(event);
  } catch (e) {
    return e.statusCode
      ? createResponse(e.statusCode, e.message)
      : createResponse(500, "Internal server error");
  }
}