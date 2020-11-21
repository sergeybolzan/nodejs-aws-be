import {createResponse} from "../utils/create-response";
import {StatusCodes, ReasonPhrases} from "http-status-codes";

export const errorHandler = (func: Function) => async (...params) => {
    try {
        return await func(...params);
    } catch (e) {
        return e.statusCode
            ? createResponse(e.statusCode, e.message)
            : createResponse(StatusCodes.INTERNAL_SERVER_ERROR, e.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}