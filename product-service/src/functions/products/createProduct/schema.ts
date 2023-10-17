export default {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    imageUrl: { type: 'string' },
  },
  required: ['title', 'price'],
} as const;
