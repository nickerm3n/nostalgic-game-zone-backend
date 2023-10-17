# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

To ensure that everything is set up correctly, you'll want to test both locally and after deploying to AWS.

### Local Testing

__Start the Serverless Offline__: This will emulate AWS Lambda and API Gateway locally.

```shell
npm run start
```

Once it's running, you should see endpoints being listed in the terminal.

### Swagger UI for Testing:

or a more user-friendly interface and detailed view of the available endpoints, you can use the Swagger UI. Post deployment, you can access it via:
[Swagger UI for the product service](https://bodgq2gex2.execute-api.eu-west-1.amazonaws.com/swagger)
Additionally, once the deployment is completed, a link to the Swagger UI is provided in the terminal output for easy access.

### Clean up resources

To ensure you aren't incurring unnecessary charges, you can remove the deployed resources once testing is completed:

```shell
npm run remove
```

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `mocks` - containing mock data used for local development
- `types` - containing interfaces and types for your data models.

```
.
├── src
│   ├── functions                         # Lambda configuration and source code folder
│   │   └── products                      # getProducts lambda configuration and source code folder
│   │       ├── getProductsById
│   │       │   ├── handler.ts            # `getProductsById` lambda source code
│   │       │   ├── handler.test.ts       # `getProductsById` lambda test
│   │       │   └── index.ts              # `getProductsById` lambda Serverless configuration
│   │       ├── getProductsList
│   │       │   ├── handler.ts            # `getProductsList` lambda source code
│   │       │   ├── handler.test.ts       # `getProductsById` lambda test
│   │       │   └── index.ts              # `getProductsList` lambda Serverless configuration
│   │       ├── createProduct
│   │       │   ├── handler.ts            # `createProduct` lambda source code
│   │       │   ├── handler.test.ts       # `createProduct` lambda test
│   │       │   ├── schema.ts             # `createProduct` schema for validation of incoming requests
│   │       │   └── index.ts              # `createProduct` lambda Serverless configuration
│   │       └── index.ts                  # Import/export of all lambda configurations
│   │
│   ├── libs                              # Lambda shared code
│   │    └── apiGateway.ts                # API Gateway specific helpers
│   │    └── handlerResolver.ts           # Sharable library for resolving lambda handlers
│   │    └── lambda.ts                    # Lambda middleware
│   │
│   ├── mocks                             # Mock data
│   │   └── products.ts                   # Products mock data
│   │
│   └── types                             # Data models and interfaces
│       └── product.d.ts                  # Product interface
│
├── package.json
├── serverless.ts                       # Serverless service file
├── tsconfig.json                       # Typescript compiler configuration
├── tsconfig.paths.json                 # Typescript paths
├── jest.config.js                      # Jest configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
