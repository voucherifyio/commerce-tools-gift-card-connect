import { Address, LineItem } from '@commercetools/connect-payments-sdk';
import { mapLineItemsToVoucherifyOrderItems } from '../mappers/item.mapper';
import { ValidationsValidateStackableParams } from '../clients/types/validations';
import { RedemptionsRedeemStackableParams } from '../clients/types/redemptions';

export class RequestParametersBuilder<T extends ValidationsValidateStackableParams | RedemptionsRedeemStackableParams> {
  #parameters: T = {} as T;

  setRedeemable(redeemGiftCardCode: string, creditsToRedeem: number) {
    this.#parameters = {
      ...this.#parameters,
      redeemables: [
        {
          object: 'voucher',
          id: redeemGiftCardCode,
          gift: { credits: creditsToRedeem },
        },
      ],
    };

    return this;
  }

  setOrder(amount: number, lineItems: LineItem[], metadataPropertyKeys: string[] = [], currencyCode: string) {
    this.#parameters = {
      ...this.#parameters,
      order: {
        amount: amount,
        items: mapLineItemsToVoucherifyOrderItems(lineItems, metadataPropertyKeys),
        metadata: { ct_currency: currencyCode },
      },
    };

    return this;
  }

  setSession(sessionId: string, ttlHours: number = 3) {
    this.#parameters = {
      ...this.#parameters,
      session: { type: 'LOCK', key: `CT-gift-card:${sessionId}`, ttl_unit: 'HOURS', ttl: ttlHours },
    };

    return this;
  }

  setCustomer(customerId?: string, shippingAddress?: Address) {
    const getName = () => {
      if (shippingAddress?.firstName || shippingAddress?.lastName) {
        return `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`;
      }
      return undefined;
    };

    this.#parameters = {
      ...this.#parameters,
      customer: {
        source_id: customerId || undefined,
        name: getName(),
        email: shippingAddress?.email || undefined,
        address: {
          city: shippingAddress?.city || undefined,
          country: shippingAddress?.country || undefined,
          postal_code: shippingAddress?.postalCode || undefined,
          line_1: shippingAddress?.streetName || undefined,
        },
        phone: shippingAddress?.phone || undefined,
        metadata: { source_id: customerId },
      },
    };

    return this;
  }

  build() {
    return this.#parameters;
  }
}
