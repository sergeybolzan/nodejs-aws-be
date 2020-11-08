import "source-map-support/register";
import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import {StatusCodes} from "http-status-codes";
import * as createError from "http-errors";
import {errorHandler} from "../common/error-handler";
import {Client} from "pg";
import {createResponse} from "../utils/create-response";
import {config} from "../common/config";
import {scripts} from "../scripts/scripts";
import {logRequest} from "../common/log-request";

export const createProduct = errorHandler(async (event: APIGatewayProxyEvent) => {
    logRequest(event);
    let body: any;
    try {
        body = JSON.parse(event?.body);
    } catch (e) {
        throw new createError.BadRequest(e.message);
    }
    if (!body?.title || !body?.count) {
        throw new createError.BadRequest("Title or count fields are absent");
    }

    const client: Client = new Client(config.databaseOptions);
    await client.connect();

    let id: string;
    try {
        await client.query("BEGIN");
        const response = await client.query(scripts.createProduct, [body.title, body.description, body.price]);
        id = response.rows[0].id;
        await client.query(scripts.createStock, [id, body.count]);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.end();
    }

    return createResponse(StatusCodes.OK, id);
});
