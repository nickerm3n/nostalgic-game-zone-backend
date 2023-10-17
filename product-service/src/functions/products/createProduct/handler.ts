import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { v4 as uuidv4 } from 'uuid';

import { docClient } from '@dynamodb/docClient';
import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
  const productData = event.body;

  try {
    const newProduct = await docClient.send(
      new PutCommand({
        TableName: 'products',
        Item: {
          id: uuidv4(),
          ...productData,
        },
      }),
    );

    return formatJSONResponse({
      product: newProduct,
    });
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(createProduct);
