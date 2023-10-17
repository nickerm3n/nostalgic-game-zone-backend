import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Stock } from 'src/types/stock';

export class StockService {
  constructor(private docClient: DynamoDBDocumentClient) {}

  async getAllStocks() {
    const stocks = await this.docClient.send(
      new ScanCommand({
        TableName: 'stocks',
      }),
    );

    return stocks.Items as Stock[];
  }
}
