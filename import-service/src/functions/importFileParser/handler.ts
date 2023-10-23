// import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
// import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3Client = new S3Client({ region: "eu-west-1" });

const importFileParser = async (event) => {
  console.log("=====>");
  // @ts-ignore
  console.log(event.Records);
};

export const main = middyfy(importFileParser);
