import { EventAPIGatewayEventWithPathParameters, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { docClient } from '@dynamodb/docClient';

import { ProductService } from '../../../services/productService';

const productService = new ProductService(docClient);

type ProductPathParameters = {
  productId: string;
};

const getProductsById: EventAPIGatewayEventWithPathParameters<
  ProductPathParameters
> = async event => {
  const { productId } = event.pathParameters;

  try {
    const product = await productService.getProductById(productId);

    if (!product) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }

    return formatJSONResponse({ product });
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(getProductsById);
