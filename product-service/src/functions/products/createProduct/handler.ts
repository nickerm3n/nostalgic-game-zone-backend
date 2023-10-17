import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { docClient } from '@dynamodb/docClient';
import { productSchema } from './schema';
import { ProductService } from '../../../services/productService';

import { z } from 'zod';

const productService = new ProductService(docClient);

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  z.infer<typeof productSchema>
> = async event => {
  const productData = event.body;

  if (!productSchema.safeParse(productData).success) {
    return formatJSONResponse(
      {
        message: 'Invalid product data',
      },
      400,
    );
  }

  try {
    const newProduct = await productService.createProduct(productData);

    return formatJSONResponse({
      product: newProduct,
    });
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(createProduct);
