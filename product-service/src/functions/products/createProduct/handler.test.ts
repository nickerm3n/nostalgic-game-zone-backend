import { main as createProduct } from './handler';
import { APIGatewayProxyResult } from 'aws-lambda';
import { ProductService } from '../../../services/productService';

jest.mock('@libs/lambda', () => ({
  middyfy: handler => handler,
}));

jest.mock('@dynamodb/docClient');
jest.mock('../../../services/productService');

describe('createProduct handler', () => {
  let event, mockContext, mockCallback;

  beforeEach(() => {
    event = {
      body: {},
    };
    mockContext = {};
    mockCallback = jest.fn();

    // Reset all mocks before each test
    (ProductService.prototype.createProduct as jest.Mock).mockReset();
  });

  it('should return a 400 error for invalid product data', async () => {
    event.body = { title: 'Test Product' }; // Assuming this is invalid data

    const response = (await createProduct(
      event,
      mockContext,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(JSON.stringify({ message: 'Invalid product data' }));
  });

  it('should create a product successfully', async () => {
    event.body = {
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
    };

    (ProductService.prototype.createProduct as jest.Mock).mockResolvedValue(event.body);

    const response = (await createProduct(
      event,
      mockContext,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ product: event.body }));
  });

  it('should return a 500 error for service exceptions', async () => {
    event.body = {
      title: 'Test Product',
      description: 'Test Description',
      price: 100,
    };

    (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(
      new Error('Service Error'),
    );

    const response = (await createProduct(
      event,
      mockContext,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(JSON.stringify(new Error('Service Error')));
  });
});
