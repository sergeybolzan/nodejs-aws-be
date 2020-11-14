import {expect, test} from "@jest/globals";
import {getProductsList} from "./get-products-list";
import {getProductsById} from "./get-products-by-id";
import testEvent from "../test-event.json";

test("getProductsList returns a products", async () => {
  const response = await getProductsList();
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body)).toEqual([]);
});

test("getProductsById returns a product", async () => {
  // @ts-ignore
  const response = await getProductsById(testEvent);
  expect(JSON.parse(response.body)).toEqual({});
});
