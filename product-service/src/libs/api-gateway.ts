import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: S;
};
type APIGatewayEventWithPathParameters<S> = Omit<APIGatewayProxyEvent, 'pathParameters'> & {
  pathParameters: S;
};

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;
export type EventAPIGatewayEventWithPathParameters<S> = Handler<
  APIGatewayEventWithPathParameters<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
