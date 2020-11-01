import "source-map-support/register";
import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import productList from "../data/productList.json";
import {errorHandler} from "../errors/error-handler";
import {NotFoundError} from "../errors/not-found-error";

export const getProductsById = errorHandler(async (event: APIGatewayProxyEvent) => {
  const id: string = event?.pathParameters?.productId;
  const product: Product = await getProduct(id);
  if (!product) {
    throw new NotFoundError("Product");
  }
  return {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(product)
  };
});

const getProduct = async (id: string): Promise<Product> => {
  const product = productList.find((product: Product) => product.id === id);
  return Promise.resolve(product);
};
