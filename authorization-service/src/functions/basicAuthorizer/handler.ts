import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from "aws-lambda";
import { generatePolicy } from "@functions/basicAuthorizer/helper";

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
  const storedPasswordKey = process.env.PASSWORD_KEY;
  const storedUserPassword = process.env[storedPasswordKey];

  const authorizationToken = event.authorizationToken;

  if (!authorizationToken) {
    throw new Error("Unauthorized"); // Respond with 401 Unauthorized if no token is present
  }

  const encodedCreds = authorizationToken.replace("Basic ", "");
  const buff = Buffer.from(encodedCreds, "base64");
  const [username, password] = buff.toString("utf-8").split(":");

  console.log(`username: ${username}, password: ${password}`);

  if (
    !username ||
    !password ||
    username !== storedPasswordKey ||
    password !== storedUserPassword
  ) {
    return generatePolicy(encodedCreds, "Deny", event.methodArn);
  } else {
    return generatePolicy(encodedCreds, "Allow", event.methodArn);
  }
};

export const main = basicAuthorizer;
