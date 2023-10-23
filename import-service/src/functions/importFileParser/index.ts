import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "${self:custom.client.bucketName}",
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: "uploads/",
          },
          {
            suffix: ".csv",
          },
        ],
        existing: true,
      },
    },
  ],
};
