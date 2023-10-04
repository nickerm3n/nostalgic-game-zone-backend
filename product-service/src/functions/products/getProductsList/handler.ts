import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { products } from '@mocks/products';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

const getProductsList: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
  return formatJSONResponse({
    products,
  });
};

export const main = middyfy(getProductsList);
