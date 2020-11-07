import {expect, test} from "@jest/globals";
import {getProductsList} from "./get-products-list";
import {getProductsById} from "./get-products-by-id";
import productList from "../data/productList.json";
import testEvent from "../test-event.json";

const testProduct: Product = productList.find((product: Product) => product.id === testEvent.pathParameters.productId);

test("getProductsList returns a products", async () => {
  const response = await getProductsList();
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body)).toEqual(productList);
});

test("getProductsById returns a product", async () => {
  // @ts-ignore
  const response = await getProductsById(testEvent);
  expect(JSON.parse(response.body)).toEqual(testProduct);
});
