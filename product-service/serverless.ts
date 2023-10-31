import type { AWS } from '@serverless/typescript';

import {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess,
} from '@functions/products';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-auto-swagger',
    'serverless-offline',
    'serverless-dynamodb-local',
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_TOPIC_ARN: {
        Ref: 'createProductTopic',
      },
      SQS_QUEUE_URL: {
        'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: [
          'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/products',
          'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/stocks',
        ],
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: {
          'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
        },
      },
      {
        Effect: 'Allow',
        Action: 'sns:Publish',
        Resource: {
          Ref: 'createProductTopic',
        },
      },
    ],
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      typefiles: ['./src/types/product.d.ts'],
      host: '${env:SWAGGER_HOST}',
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'Product creation topic',
          TopicName: 'createProductTopic',
        },
      },
      TopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: 'mykyta_kurylko@epam.com',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'products',
          AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'stocks',
          AttributeDefinitions: [{ AttributeName: 'product_id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'product_id', KeyType: 'HASH' }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Description: 'URL for the catalog items SQS queue',
        Value: { Ref: 'catalogItemsQueue' },
        Export: {
          Name: '${self:service}-${self:provider.stage}-CatalogItemsQueueUrl',
        },
      },
      CatalogItemsQueueArn: {
        Description: 'ARN for the catalog items SQS queue',
        Value: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        Export: {
          Name: '${self:service}-${self:provider.stage}-CatalogItemsQueueArn',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
