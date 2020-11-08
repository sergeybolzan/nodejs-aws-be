import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";

export const logRequest = (event: APIGatewayProxyEvent) => {
    console.log(`Body: ${JSON.stringify(event?.body)}, Path: ${event?.path}, Path parameters: ${JSON.stringify(event?.pathParameters)}`);
};
