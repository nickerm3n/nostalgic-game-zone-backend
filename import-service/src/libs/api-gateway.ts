import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

type ValidatedAPIGatewayProxyEvent<S, P> = Omit<
  APIGatewayProxyEvent,
  "body" | "queryStringParameters"
> & { body: S; queryStringParameters: P };
export type ValidatedEventAPIGatewayProxyEvent<S = {}, P = {}> = Handler<
  ValidatedAPIGatewayProxyEvent<S, P>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
