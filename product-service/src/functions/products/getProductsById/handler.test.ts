import { products } from '@mocks/products';
import { main as getProductsById } from './handler';
import { APIGatewayProxyResult } from 'aws-lambda';

jest.mock('@libs/lambda', () => ({
  middyfy: handler => handler,
}));

describe('getProductsById handler', () => {
  let event, mockContext, mockCallback;

  beforeEach(() => {
    event = {
      pathParameters: {},
    };
    mockContext = {}; // You can expand this if you need to mock specific context properties
    mockCallback = jest.fn();
  });

  it('should return the correct product when found', async () => {
    event.pathParameters.productId = products[0].id;

    const response = (await getProductsById(
      event,
      mockContext,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ product: products[0] }));
  });

  it('should return a 404 error when the product is not found', async () => {
    event.pathParameters.productId = 'non-existent-id';

    const response = (await getProductsById(
      event,
      mockContext,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(JSON.stringify({ message: 'Product not found' }));
  });
});
