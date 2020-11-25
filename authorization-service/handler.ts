import {APIGatewayAuthorizerResult} from 'aws-lambda';
import 'source-map-support/register';

export const basicAuthorizer = async (event, _context, callback) => {
  console.log('Event: ', JSON.stringify(event));

  if (event['type'] !== 'TOKEN') {
    callback('Unauthorized');
  }

  try {
    const token = event.authorizationToken;

    const encodedCreds = token.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];
    const effect = storedUserPassword && storedUserPassword === password ? 'Allow' : 'Deny';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    callback(null, policy);
  } catch (e) {
    callback(`Unauthorized: ${e.message}`);
  }
}

const generatePolicy = (principalId, resource, effect = 'Allow'): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}