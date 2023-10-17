import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { docClient } from '@dynamodb/docClient';

import { ProductService } from '../../../services/productService';
import { StockService } from '../../../services/stockService';

import { joinProductsAndStocks } from '../helpers';

const productService = new ProductService(docClient);
const stockService = new StockService(docClient);

const getProductsList: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
  try {
    const products = await productService.getAllProducts();
    const stocks = await stockService.getAllStocks();

    return formatJSONResponse({
      products: joinProductsAndStocks(products, stocks),
    });
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(getProductsList);
