import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        cors: {
          origin: "*",
        },
        authorizer: {
          arn: "arn:aws:lambda:eu-west-1:257906676962:function:authorization-service-dev-basicAuthorizer",
          identitySource: "method.request.header.Authorization",
          name: "basicAuthorizer",
          resultTtlInSeconds: 0,
          type: "token",
        },
      },
    },
  ],
};
