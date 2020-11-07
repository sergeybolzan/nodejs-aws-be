import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import {createResponse} from "../utils/create-response";
import {StatusCodes, ReasonPhrases} from "http-status-codes";

export const errorHandler = (func: Function) => async (event?: APIGatewayProxyEvent) => {
    try {
        return await func(event);
    } catch (e) {
        return e.statusCode
            ? createResponse(e.statusCode, e.message)
            : createResponse(StatusCodes.INTERNAL_SERVER_ERROR, e.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}