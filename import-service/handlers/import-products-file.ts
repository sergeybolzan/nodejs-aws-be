import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import {S3} from 'aws-sdk';
import {StatusCodes} from 'http-status-codes';
import {logRequest} from '../common/log-request';
import {errorHandler} from '../common/error-handler';
import {createResponse} from '../utils/create-response';
import {config} from '../common/config';

export const importProductsFile: APIGatewayProxyHandler = errorHandler(async (event: APIGatewayProxyEvent) => {
  logRequest(event);
  const filePath: string = `uploaded/${(event.queryStringParameters.name)}`;

  const s3: S3 = new S3({region: 'eu-west-1', signatureVersion: 'v4'});
  const params = {
    Bucket: config.BUCKET_NAME,
    Key: filePath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  const url: string = await s3.getSignedUrl('putObject', params);

  return createResponse(StatusCodes.OK, url);
});
