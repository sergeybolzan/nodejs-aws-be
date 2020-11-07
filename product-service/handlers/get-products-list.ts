import "source-map-support/register";
import productList from "../data/productList.json";
import {errorHandler} from "../errors/error-handler";
import {createResponse} from "../utils/create-response";

export const getProductsList = errorHandler(async () => {
  const products: Product[] = await getProducts();
  return createResponse(200, products);
});

const getProducts = (): Promise<Product[]> => {
  return Promise.resolve(productList);
};
