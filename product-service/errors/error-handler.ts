import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";

export const errorHandler = (func: Function) => async (event?: APIGatewayProxyEvent) => {
  try {
    return func(event);
  } catch (e) {
    return e.statusCode ? {
      statusCode: e.statusCode,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: e.message
    } : {
      statusCode: 500,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: "Internal server error"
    }
  }
}