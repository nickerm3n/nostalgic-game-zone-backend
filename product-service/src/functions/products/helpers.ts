import { Product } from '../../types/product';
import { Stock } from '../../types/stock';

export const joinProductsAndStocks = (products: Product[], stocks: Stock[]) => {
  const combinedData = [];
  for (const product of products) {
    const stock = stocks.find(stock => stock.product_id === product.id);
    combinedData.push({
      ...product,
      count: stock ? stock.count : 0,
    });
  }
  return combinedData;
};
