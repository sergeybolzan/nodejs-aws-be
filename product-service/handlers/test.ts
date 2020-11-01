import {expect, test} from "@jest/globals";
import {getProductsList} from "./get-products-list";
import {getProductsById} from "./get-products-by-id";
import productList from "../data/productList.json";
import testEvent from "../test-event.json";

const testProduct: Product = {
  "count": 6,
  "description": "Short Product Description3",
  "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
  "price": 10,
  "title": "ProductNew"
}

test("getProductsList return a products", async () => {
  const response = await getProductsList();
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body)).toEqual(productList);
});

test("getProductsById return a product", async () => {
  // @ts-ignore
  const response = await getProductsById(testEvent);
  expect(JSON.parse(response.body)).toEqual(testProduct);
});
