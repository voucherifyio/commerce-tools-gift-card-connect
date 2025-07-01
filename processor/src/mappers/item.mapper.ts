import { LineItem } from '@commercetools/connect-payments-sdk';
import { OrdersItem } from '../clients/types/orders';

export const mapLineItemsToVoucherifyOrderItems = (
  lineItems: LineItem[],
  metadataSchemaProperties: string[] = [],
): OrdersItem[] => {
  return lineItems
    .filter((item) => item.quantity > 0)
    .map((item: LineItem) => {
      return {
        source_id: item?.variant?.sku,
        related_object: 'sku',
        quantity: getQuantity(item),
        amount: item.totalPrice.centAmount, // tax is included
        product: {
          override: true,
          name: Object.values(item.name)?.[0],
        },
        sku: {
          override: true,
          sku: Object.values(item.name)?.[0],
          metadata: getMetadata(item?.variant?.attributes, metadataSchemaProperties),
        },
      };
    });
};

const getQuantity = (item: LineItem) => {
  // we have only gift vouchers so we don't need support unit type
  return item?.quantity;
};

const getMetadata = (attributes?: { name: string; value: any }[], metadataSchemaProperties?: string[]) => {
  if (!Array.isArray(attributes) || !Array.isArray(metadataSchemaProperties)) {
    return {};
  }

  return Object.fromEntries(
    attributes
      .filter((attribute) => metadataSchemaProperties.includes(attribute.name))
      .map((attribute) => [attribute.name, attribute.value]),
  );
};
