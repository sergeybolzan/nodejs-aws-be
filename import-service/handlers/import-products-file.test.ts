import * as AWSMock from 'aws-sdk-mock';
import {describe, expect, it} from '@jest/globals';
import {APIGatewayProxyResult} from 'aws-lambda';
import {importProductsFile} from './import-products-file';

const MOCK_URL: string = 'https://mock-url.com';

describe('Import products file module', () => {
  it('should return signed url', async () => {
    AWSMock.mock('S3', 'getSignedUrl', MOCK_URL);

    // @ts-ignore
    const response: APIGatewayProxyResult = await importProductsFile({queryStringParameters: {}});
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toBe(MOCK_URL);

    AWSMock.restore('S3');
  });
});
