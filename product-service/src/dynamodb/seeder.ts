import { products } from '@mocks/products';

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './docClient';

// Function to seed the database
const seedDatabase = async () => {
  for (const product of products) {
    // Insert into products table
    const productParams = {
      TableName: 'products',
      Item: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    };

    // Insert into stocks table with a random count for demonstration
    const stockParams = {
      TableName: 'stocks',
      Item: {
        product_id: product.id,
        count: Math.floor(Math.random() * 10) + 1, // Random stock count between 1 and 10
      },
    };

    try {
      await docClient.send(new PutCommand(productParams));
      await docClient.send(new PutCommand(stockParams));
      console.log(`Inserted product: ${product.title}`);
    } catch (error) {
      console.error(`Error inserting product: ${product.title}. Error:`, error);
    }
  }
};

seedDatabase();
