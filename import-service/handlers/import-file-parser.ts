import {S3Event} from 'aws-lambda';
import {S3, SQS} from 'aws-sdk';
import * as csv from 'csv-parser';
import {StatusCodes} from 'http-status-codes';
import {config} from '../common/config';

export const importFileParser = (event: S3Event) => {
  const s3: S3 = new S3({region: 'eu-west-1'});
  const sqs = new SQS();

  for (const record of event.Records) {
    const s3Stream = s3.getObject({
      Bucket: config.BUCKET_NAME,
      Key: record.s3.object.key
    }).createReadStream();

    s3Stream.pipe(csv())
      .on('data', (data) => {
        const dataString: string = JSON.stringify(data);
        sqs.sendMessage({
          QueueUrl: config.CATALOG_ITEMS_QUEUE_URL,
          MessageBody: dataString
        }, (err) => {
          if (err) {
            console.log('SQS error', err);
          } else {
            console.log(`Send message for: ${dataString}`);
          }
        });
      })
      .on('end', async () => {
        console.log(`Copy from ${config.BUCKET_NAME}/${record.s3.object.key}`);

        await s3.copyObject({
          Bucket: config.BUCKET_NAME,
          CopySource: `${config.BUCKET_NAME}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed')
        }).promise();

        console.log(`Copied into ${config.BUCKET_NAME}/${record.s3.object.key.replace('uploaded', 'parsed')}`);

        await s3.deleteObject({
          Bucket: config.BUCKET_NAME,
          Key: record.s3.object.key
        }).promise();

        console.log(`File ${record.s3.object.key} is deleted`);
      });
  }

  return {
    statusCode: StatusCodes.ACCEPTED
  };
};
