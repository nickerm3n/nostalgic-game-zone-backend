import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        responses: {
          200: {
            description: 'Product',
            bodyType: 'Product',
          },
        },
      },
    },
  ],
};
