import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { generatePolicy } from "@functions/basicAuthorizer/helper";

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  const authorizationToken = event.authorizationToken;

  if (!authorizationToken) {
    throw new Error("Unauthorized"); // Respond with 401 Unauthorized if no token is present
  }

  const encodedCreds = authorizationToken.replace("Basic ", "");
  const buff = Buffer.from(encodedCreds, "base64");
  const [username, password] = buff.toString("utf-8").split(":");

  const expectedPassword = process.env[username];

  if (password === expectedPassword) {
    return generatePolicy(encodedCreds, "Allow", event.methodArn);
  } else {
    return generatePolicy(encodedCreds, "Deny", event.methodArn);
  }
};

export const main = basicAuthorizer;
