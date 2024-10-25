import { Amount, BalanceType, BaseOptions, GiftCardComponent, GiftCardOptions } from "../providers/definitions";
import { BaseComponentBuilder, DefaultComponent } from "./definitions"
import { fieldIds, getInput } from "./utils";

export class FormBuilder extends BaseComponentBuilder {
  constructor(baseOptions: BaseOptions) {
    super(baseOptions);
  }

  build(config: GiftCardOptions): GiftCardComponent {
    return new FormComponent({
      giftcardOptions: config,
      baseOptions: this.baseOptions,
    })
  }
}

export class FormComponent extends DefaultComponent {
  constructor(opts: {
    giftcardOptions: GiftCardOptions;
    baseOptions: BaseOptions;
  }) {
    super(opts);
  }

  async balance(): Promise<BalanceType> {
    try {
      const giftCardCode = getInput(fieldIds.code).value.replace(/\s/g, '')
      const fetchBalanceURL = this.baseOptions.processorUrl.endsWith("/")
        ? `${this.baseOptions.processorUrl}balance/${giftCardCode}`
        : `${this.baseOptions.processorUrl}/balance/${giftCardCode}`
      const response = await fetch(fetchBalanceURL, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": this.baseOptions.sessionId,
        },
      });

      return await response.json();
    } catch(err) {
      this.baseOptions.onError(err);
    }
    return null
  }

  submit(_: { amount?: Amount }): void {
    // TODO: Implement call to /redeem https://commercetools.atlassian.net/browse/SCC-2621
    return null
  }

  mount(_: string): void {
    // TODO: Mount input field component here https://commercetools.atlassian.net/browse/SCC-2619
    return null
  }

  // TODO: implement a method that returns the form html element, call this method in the mount method.
}