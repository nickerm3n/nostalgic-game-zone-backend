import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import csv from "csv-parser";
import stream, { Readable } from "stream";
import { S3Event } from "aws-lambda";
import { streamToString } from "./helpers";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const s3Client = new S3Client();
const sqsClient = new SQSClient();

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

export const main = async (event: S3Event): Promise<void> => {
  const s3Record = event.Records[0].s3;
  const bucket = s3Record.bucket.name;
  const key = decodeURIComponent(s3Record.object.key.replace(/\+/g, " "));

  try {
    const getObjectParams = {
      Bucket: bucket,
      Key: key,
    };

    const dataStream = (
      await s3Client.send(new GetObjectCommand(getObjectParams))
    ).Body as Readable;

    const dataString = await streamToString(dataStream);

    const data = [];

    stream.Readable.from(dataString)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", async () => {
        console.log(`Parsed ${data.length} rows from CSV in ${key}`);

        if (!data.length) {
          return;
        }

        await sqsClient.send(
          new SendMessageCommand({
            MessageBody: JSON.stringify(data),
            QueueUrl: SQS_QUEUE_URL,
          }),
        );

        // Copy the file to the 'parsed' folder
        const destinationKey = key.replace("uploaded/", "parsed/");
        await s3Client.send(
          new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${key}`,
            Key: destinationKey,
          }),
        );

        // Delete the file from the 'uploaded' folder
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
          }),
        );

        console.log(
          `Moved file from 'uploaded' to 'parsed' folder: ${key} -> ${destinationKey}`,
        );
      });
  } catch (error) {
    console.error(`Error processing S3 object ${bucket}/${key}:`, error);
  }
};
