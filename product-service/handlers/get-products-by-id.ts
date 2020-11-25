import "source-map-support/register";
import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import {validate as uuidValidate} from "uuid";
import {StatusCodes} from "http-status-codes";
import * as createError from "http-errors";
import {errorHandler} from "../common/error-handler";
import {Client} from "pg";
import {createResponse} from "../utils/create-response";
import {config} from "../common/config";
import {scripts} from "../scripts/scripts";
import {logRequest} from "../common/log-request";

export const getProductsById = errorHandler(async (event: APIGatewayProxyEvent) => {
    logRequest(event);
    const id: string = event?.pathParameters?.productId;
    if (!uuidValidate(id)) {
        throw new createError.BadRequest();
    }

    const client: Client = new Client(config.DATABASE_OPTIONS);
    await client.connect();

    let products: Product[];
    try {
        const response = await client.query(scripts.getProductById, [id]);
        products = response.rows;
    } catch (e) {
        throw e;
    } finally {
        client.end();
    }

    const product: Product = products[0];
    if (!product) {
        throw new createError.NotFound();
    }
    return createResponse(StatusCodes.OK, product);
});
