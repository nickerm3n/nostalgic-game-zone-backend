import { main as getProductsList } from './handler'; // Adjust the import path
import { products } from '@mocks/products';

jest.mock('@libs/lambda', () => ({
  middyfy: (handler: any) => handler,
}));

describe('getProductsList handler', () => {
  let event, mockContext, mockCallback;

  beforeEach(() => {
    event = {};
    mockContext = {}; // You can expand this if you need to mock specific context properties
    mockCallback = jest.fn();
  });

  it('should return the list of products', async () => {
    const response = await getProductsList(event, mockContext, mockCallback);

    expect(response.body).toEqual({ products: JSON.stringify(products) });
  });
});
