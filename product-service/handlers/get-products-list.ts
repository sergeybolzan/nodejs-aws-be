import "source-map-support/register";
import productList from "../data/productList.json";
import {errorHandler} from "../errors/error-handler";

export const getProductsList = errorHandler(async () => {
  const products: Product[] = await getProducts();
  return {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(products)
  };
});

const getProducts = (): Promise<Product[]> => {
  return Promise.resolve(productList);
};
