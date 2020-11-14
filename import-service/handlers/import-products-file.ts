import {APIGatewayProxyHandler} from 'aws-lambda';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'import-service-nodejs-bucket';

export const importProductsFile: APIGatewayProxyHandler = async () => {
  const s3 = new AWS.S3({region: 'eu-west-1'});
  let status = 200;
  let thumbnails = [];
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: 'thumbnails/'
  };

  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    thumbnails = s3Response.Contents;
  } catch (e) {
    console.error(e);
    status = 500;
  }

  return {
    statusCode: status,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(
      thumbnails
        .filter((thumbnail) => thumbnail.Size)
        .map((thumbnail) => `https://${BUCKET_NAME}.s3.amazonaws.com/${thumbnail.Key}`)
    )
  };
};
