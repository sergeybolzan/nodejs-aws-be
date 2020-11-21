import {APIGatewayProxyEvent, APIGatewayProxyHandler, S3Event} from 'aws-lambda';
import {SNS} from 'aws-sdk';
import {StatusCodes} from 'http-status-codes';
import {logRequest} from '../common/log-request';
import {errorHandler} from '../common/error-handler';
import {createResponse} from '../utils/create-response';
import {config} from '../common/config';

export const usersInvite = (event) => {
  const users = event.Records.map(({body}) => body);
  const sns = new SNS({region: 'eu-west-1'});
  console.log('AAAAAAAAA', users);

  sns.publish({
    Subject: 'You are invited',
    Message: JSON.stringify(users),
    TopicArn: config.SNS_ARN
  }, () => {
    console.log(`Send email for: ${JSON.stringify(users)}`);
  });
};
