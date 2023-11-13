import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SQS_QUEUE_URL: {
        "Fn::ImportValue": "product-service-dev-CatalogItemsQueueUrl",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sqs:SendMessage",
            Resource: {
              "Fn::ImportValue": "product-service-dev-CatalogItemsQueueArn",
            },
          },
          {
            Effect: "Allow",
            Action: [
              "s3:ListBucket",
              "s3:PutObject",
              "s3:GetObjectAcl",
              "s3:GetObject",
              "s3:PutObjectVersionAcl",
              "s3:GetObjectTagging",
              "s3:DeleteObject",
              "s3:GetBucketLocation",
              "s3:PutObjectAcl",
            ],
            Resource: "arn:aws:s3:::${self:custom.client.bucketName}/*",
            Sid: "AllowPublic",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    client: {
      bucketName: "s3-nostalgic-game-zone",
      s3BucketName: "${self:custom.client.bucketName}",
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      S3ImportBucker: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.client.bucketName}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ["PUT"],
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
              },
            ],
          },
        },
      },
      GatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
