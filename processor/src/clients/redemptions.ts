import * as T from './types/redemptions';

import type { RequestController } from './voucherify-request-controller';

export class Redemptions {
  constructor(private client: RequestController) {}

  /**
   * @see https://docs.voucherify.io/reference/redeem-stacked-discounts
   */
  public redeemStackable(params: T.RedemptionsRedeemStackableParams) {
    return this.client.post<T.RedemptionsRedeemStackableResponse>(`/redemptions`, params);
  }
}
