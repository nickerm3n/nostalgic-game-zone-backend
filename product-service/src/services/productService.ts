import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Product } from '../types/product';

import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  constructor(
    private docClient: DynamoDBDocumentClient,
    private tableName = 'products',
  ) {}

  async getAllProducts() {
    const products = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return products.Items as Product[];
  }

  async getProductById(productId: string) {
    const product = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id: productId },
      }),
    );

    return product.Item as Product;
  }

  async createProduct(product: Partial<Product>) {
    const newProduct = await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: { id: uuidv4(), ...product },
      }),
    );

    return newProduct;
  }
}
