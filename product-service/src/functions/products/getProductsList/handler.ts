import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { docClient } from '@dynamodb/docClient';

const getProductsList: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
  try {
    const productsData = await docClient.send(
      new ScanCommand({
        TableName: 'products',
      }),
    );

    const products = productsData.Items;

    const combinedData = [];
    for (const product of products) {
      const stockData = await docClient.send(
        new GetCommand({
          TableName: 'stocks',
          Key: { product_id: product.id },
        }),
      );

      const stock = stockData.Item;

      combinedData.push({
        ...product,
        count: stock ? stock.count : 0,
      });
    }

    return formatJSONResponse({
      products: combinedData,
    });
  } catch (error) {
    return formatJSONResponse({
      error,
    });
  }
};

export const main = middyfy(getProductsList);
