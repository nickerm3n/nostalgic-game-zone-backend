import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "eu-west-1" });

interface QueryStringParameters {
  name: string;
}

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  {},
  QueryStringParameters
> = async (event) => {
  const name = event.queryStringParameters.name;

  const command = new PutObjectCommand({
    Bucket: "s3-nostalgic-game-zone",
    Key: `uploaded/${name}`,
    ContentType: "text/csv",
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return {
    statusCode: 200,
    body: signedUrl,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
    },
  };
};

export const main = middyfy(importProductsFile);
