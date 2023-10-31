// @ts-nocheck
import { SQSEvent } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { ProductService } from '../../../services/productService';
import { docClient } from '@dynamodb/docClient';
import { productSchema } from '@functions/products/createProduct/schema';

const snsClient = new SNSClient({});
const productService = new ProductService(docClient);

export const main = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const product = JSON.parse(record.body);

    console.log('Processing product', product);

    // const snsTopicArn = process.env.SNS_TOPIC_ARN;
    // if (!snsTopicArn) {
    //   throw new Error('SNS_TOPIC_ARN environment variable is not set');
    // }
    //
    // if (!productSchema.safeParse(product).success) {
    //   console.error('Invalid product data:', product);
    //   continue;
    // }
    //
    // try {
    //   const newProduct = await productService.createProduct(product);
    //
    //   const publishParams = {
    //     Message: `Product with ID ${newProduct} was successfully added.`,
    //     Subject: 'New product added!',
    //     TopicArn: snsTopicArn,
    //   };
    //
    //   const publishCommand = new PublishCommand(publishParams);
    //   await snsClient.send(publishCommand);
    // } catch (error) {
    //   console.error('Error processing product:', product);
    //   console.error(error.message);
    // }
  }
};
