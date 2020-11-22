import type {Serverless} from "serverless/aws";
import {config} from './common/config';

const serverlessConfiguration: Serverless = {
  service: "product-service",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: {
        forceExclude: 'aws-sdk'
      }
    }
  },
  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SNS_ARN: {
        Ref: 'createProductTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [{
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
        }]
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'createProductTopic'
        }
      }
    ]
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscriptionImportSuccess: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: config.EMAIL_SUCCESS,
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            status: ["success"]
          }
        }
      },
      SNSSubscriptionImportFailed: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: config.EMAIL_FAILED,
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            status: ["failed"]
          }
        }
      }
    },
    Outputs: {
      SQSQueueUrl: {
        Value: {
          Ref: 'catalogItemsQueue'
        }
      },
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
        }
      }
    }
  },
  functions: {
    getProductsList: {
      handler: "handler.getProductsList",
      events: [
        {
          http: {
            method: "get",
            path: "products",
          }
        }
      ]
    },
    getProductsById: {
      handler: "handler.getProductsById",
      events: [
        {
          http: {
            method: "get",
            path: "products/{productId}",
          }
        }
      ]
    },
    createProduct: {
      handler: "handler.createProduct",
      events: [
        {
          http: {
            method: "post",
            path: "products",
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
            }
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
