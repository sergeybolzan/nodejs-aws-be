import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const getShopInfo: APIGatewayProxyHandler = async () => {
  // await getWeather
  return {
    statusCode: 200,
    body: JSON.stringify({
      shopName: 'myshop',
      workingHours: 'From - Till '
    }),
  };
}
