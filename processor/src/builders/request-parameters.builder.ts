import { Address, LineItem } from "@commercetools/connect-payments-sdk";
import { mapLineItemsToVoucherifyOrderItems } from "../mappers/item.mapper";
import { ValidationsValidateStackableParams } from "../clients/types/validations";
import { RedemptionsRedeemStackableParams } from "../clients/types/redemptions";

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
        }

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
        }

        return this;
    }

    setSession(sessionId: string, ttlHours: number = 3) {
        this.#parameters = {
            ...this.#parameters,
            session: { type: 'LOCK', key: `CT:${sessionId}`, ttl_unit: "HOURS", ttl: ttlHours },
        }

        return this;
    }

    setCustomer(customerId?: string, shippingAddress?: Address) {
        this.#parameters = {
            ...this.#parameters,
            customer: {
                ...(customerId && { source_id: customerId }),
                ...(shippingAddress?.firstName && shippingAddress?.lastName && { name: `${shippingAddress.firstName} ${shippingAddress.lastName}` }),
                ...(shippingAddress?.email && { email: shippingAddress.email }),
                address: {
                  ...(shippingAddress?.city && { city: shippingAddress.city }),
                  ...(shippingAddress?.country && { country: shippingAddress.country }),
                  ...(shippingAddress?.postalCode && { postal_code: shippingAddress.postalCode }),
                  ...(shippingAddress?.streetName && { line_1: shippingAddress.streetName }),
                },
                ...(shippingAddress?.phone && { phone: shippingAddress.phone }),
                metadata: { source_id: customerId },
              }
        }

        return this;
    }

    build() {
        return this.#parameters;
    }
}
