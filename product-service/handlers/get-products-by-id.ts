import "source-map-support/register";
import {APIGatewayProxyEvent} from "aws-lambda/trigger/api-gateway-proxy";
import productList from "../data/productList.json";
import {errorHandler} from "../errors/error-handler";
import {NotFoundError} from "../errors/not-found-error";
import {createResponse} from "../utils/create-response";

export const getProductsById = errorHandler(async (event: APIGatewayProxyEvent) => {
  const id: string = event?.pathParameters?.productId;
  const product: Product = await getProduct(id);
  if (!product) {
    throw new NotFoundError("Product");
  }
  return createResponse(200, product);
});

const getProduct = async (id: string): Promise<Product> => {
  const product = productList.find((product: Product) => product.id === id);
  return Promise.resolve(product);
};
