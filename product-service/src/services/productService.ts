import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Product } from '../types/product';

import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  constructor(private docClient: DynamoDBDocumentClient) {}

  async getAllProducts() {
    const products = await this.docClient.send(
      new ScanCommand({
        TableName: 'products',
      }),
    );

    return products.Items as Product[];
  }

  async getProductById(productId: string) {
    const product = await this.docClient.send(
      new GetCommand({
        TableName: 'products',
        Key: { id: productId },
      }),
    );

    return product.Item as Product;
  }

  async createProduct(product: Omit<Product, 'id'>) {
    const newProduct = await this.docClient.send(
      new PutCommand({
        TableName: 'products',
        Item: { id: uuidv4(), ...product },
      }),
    );

    return newProduct;
  }
}
