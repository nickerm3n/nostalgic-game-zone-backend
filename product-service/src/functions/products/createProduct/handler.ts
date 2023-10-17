import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { docClient } from '@dynamodb/docClient';
import schema from './schema';
import { ProductService } from '../../../services/productService';

const productService = new ProductService(docClient);

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
  const productData = event.body;

  try {
    const newProduct = productService.createProduct(productData);

    return formatJSONResponse({
      product: newProduct,
    });
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(createProduct);
