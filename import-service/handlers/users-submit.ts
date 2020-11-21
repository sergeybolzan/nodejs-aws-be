import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import {SQS} from 'aws-sdk';
import {StatusCodes} from 'http-status-codes';
import {logRequest} from '../common/log-request';
import {errorHandler} from '../common/error-handler';
import {createResponse} from '../utils/create-response';
import {config} from '../common/config';

export const usersSubmit = errorHandler((event: APIGatewayProxyEvent, _, callback) => {
  const sqs = new SQS();
  console.log('AAAAAAA', event);
  const users = JSON.parse(event.body);
  console.log('BBBBBBB', users);

  users.forEach((user) => {
    sqs.sendMessage({
      QueueUrl: config.SQS_URL,
      MessageBody: user
    }, (err, data) => {
      console.log('SQS error', err);
      console.log('SQS success', data);
      console.log(`Send message for: ${user}`);
    });
  });

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
});
