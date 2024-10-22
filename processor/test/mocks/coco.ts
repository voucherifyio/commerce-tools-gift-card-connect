import { Cart } from '@commercetools/connect-payments-sdk';
import { randomUUID } from 'crypto';

export const getCartOK = () => {
  const cartId = randomUUID();
  const mockGetCartResult: Cart = {
    id: cartId,
    version: 1,
    lineItems: [],
    customLineItems: [],
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'USD',
      centAmount: 150000,
      fractionDigits: 2,
    },
    cartState: 'Ordered',
    origin: 'Customer',
    taxMode: 'ExternalAmount',
    taxRoundingMode: 'HalfEven',
    taxCalculationMode: 'LineItemLevel',
    shipping: [],
    discountCodes: [],
    directDiscounts: [],
    refusedGifts: [],
    itemShippingAddresses: [],
    inventoryMode: 'ReserveOnOrder',
    shippingMode: 'Single',
    shippingInfo: {
      shippingMethodName: 'shippingMethodName1',
      price: {
        type: 'centPrecision',
        currencyCode: 'USD',
        centAmount: 150000,
        fractionDigits: 2,
      },
      shippingRate: {
        price: {
          type: 'centPrecision',
          currencyCode: 'USD',
          centAmount: 1000,
          fractionDigits: 2,
        },
        tiers: [],
      },
      shippingMethodState: 'MatchesCart',
    },
    createdAt: '2024-01-01T00:00:00Z',
    lastModifiedAt: '2024-01-01T00:00:00Z',
  };
  return mockGetCartResult;
};
