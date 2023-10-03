import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { products } from "./mockData";

const getProductsList = async () => {
  return formatJSONResponse({
    products
  });
};

export const main = middyfy(getProductsList);
