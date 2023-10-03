import {APIGatewayProxyEvent} from "aws-lambda";

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { products } from "@mocks/products";


const getProductsList = async (event: APIGatewayProxyEvent) => {
  return formatJSONResponse({
    products,
    event
  });
};

export const main = middyfy(getProductsList);
