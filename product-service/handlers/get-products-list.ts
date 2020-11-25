import "source-map-support/register";
import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import {Client} from "pg";
import {StatusCodes} from "http-status-codes";
import {errorHandler} from "../common/error-handler";
import {createResponse} from "../utils/create-response";
import {config} from "../common/config";
import {scripts} from "../scripts/scripts";
import {logRequest} from "../common/log-request";

export const getProductsList = errorHandler(async (event: APIGatewayProxyEvent) => {
    logRequest(event);
    const client: Client = new Client(config.DATABASE_OPTIONS);
    await client.connect();

    try {
        const {rows: products} = await client.query(scripts.getProducts);
        return createResponse(StatusCodes.OK, products);
    } catch (e) {
        throw e;
    } finally {
        client.end();
    }
});
