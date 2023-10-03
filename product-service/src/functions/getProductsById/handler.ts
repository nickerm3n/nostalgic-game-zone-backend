import {EventAPIGatewayEventWithPathParameters, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { products } from "@mocks/products";

export const getProductsById: EventAPIGatewayEventWithPathParameters<{productId: string}> = async (event) => {
  const { productId } = event.pathParameters;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return formatJSONResponse({ message: "Product not found" }, 404);
  }

  return formatJSONResponse({ product });
};

export const main = middyfy(getProductsById);
