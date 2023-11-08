import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { generatePolicy } from "./helper";

const basicAuthorizer = (
  event: APIGatewayTokenAuthorizerEvent,
): APIGatewayAuthorizerResult => {
  const authorizationToken = event.authorizationToken;

  console.log(`authorizationToken: ${authorizationToken}!`);

  const encodedCreds = authorizationToken.split(" ")[1];
  const buff = Buffer.from(encodedCreds, "base64");
  const [username, password] = buff.toString("utf-8").split(":");

  const expectedPassword = process.env[username];

  if (!username || !password || password !== expectedPassword) {
    return generatePolicy(encodedCreds, "Deny", event.methodArn);
  } else {
    return generatePolicy(encodedCreds, "Allow", event.methodArn);
  }
};

export const main = basicAuthorizer;
