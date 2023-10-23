import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "eu-west-1" });

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
) => {
  const { fileName } = event.pathParameters;

  const command = new PutObjectCommand({
    Bucket: "s3-nostalgic-game-zone",
    Key: `uploaded/${fileName}`,
    ContentType: "text/csv",
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return formatJSONResponse({ signedUrl });
};

export const main = middyfy(importProductsFile);
