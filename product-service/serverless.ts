import type {Serverless} from "serverless/aws";
import { config } from "./common/config";

const serverlessConfiguration: Serverless = {
  service: "product-service",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true
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
      PG_HOST: config.databaseOptions.host,
      PG_PORT: config.databaseOptions.port,
      PG_DATABASE: config.databaseOptions.database,
      PG_USERNAME: config.databaseOptions.user,
      PG_PASSWORD: config.databaseOptions.password
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
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
