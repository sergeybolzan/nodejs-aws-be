import {S3Event} from 'aws-lambda';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'import-service-nodejs-bucket';

export const imageUpload = async (event: S3Event) => {
  const s3 = new AWS.S3({region: 'eu-west-1'});

  for (const record of event.Records) {
    await s3.copyObject({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
      Key: record.s3.object.key.replace('images', 'thumbnails')
    }).promise();

    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key
    }).promise();

    console.log(`Thumbnail for the image ${record.s3.object.key.split('/')[1]} is created`);
  }

  return {
    statusCode: 202
  };
};
