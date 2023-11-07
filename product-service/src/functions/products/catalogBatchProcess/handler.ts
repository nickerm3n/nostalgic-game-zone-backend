import { SQSEvent } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { ProductService } from '../../../services/productService';
import { docClient } from '@dynamodb/docClient';
import { productSchema } from '@functions/products/createProduct/schema';

const snsClient = new SNSClient({});
const productService = new ProductService(docClient);

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const product = JSON.parse(record.body);

    if (!productSchema.safeParse(product).success) {
      console.error('Invalid product data:', product);
      continue;
    }

    try {
      const newProduct = await productService.createProduct(product);

      const publishParams = {
        Message: `Product with ID ${newProduct} was successfully added.`,
        Subject: 'New product added!',
        TopicArn: SNS_TOPIC_ARN,
      };

      const publishCommand = new PublishCommand(publishParams);
      await snsClient.send(publishCommand);
    } catch (error) {
      console.error('Error processing product:', product);
      console.error(error.message);
    }
  }
};
