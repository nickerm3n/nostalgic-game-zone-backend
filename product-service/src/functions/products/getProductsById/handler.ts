import { EventAPIGatewayEventWithPathParameters, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { docClient } from '@dynamodb/docClient';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

type ProductPathParameters = {
  productId: string;
};

const getProductsById: EventAPIGatewayEventWithPathParameters<
  ProductPathParameters
> = async event => {
  const { productId } = event.pathParameters;

  try {
    const productData = await docClient.send(
      new GetCommand({
        TableName: 'products',
        Key: { id: productId },
      }),
    );

    const product = productData.Item;

    if (!product) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }

    const stockData = await docClient.send(
      new GetCommand({
        TableName: 'stocks',
        Key: { product_id: productId },
      }),
    );

    const stock = stockData.Item;
    const combinedData = {
      ...product,
      stock: stock ? stock : 0,
    };

    return formatJSONResponse({ product: combinedData });
  } catch (error) {
    return formatJSONResponse({
      error,
    });
  }
};

export const main = middyfy(getProductsById);
