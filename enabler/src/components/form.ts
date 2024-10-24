import { Amount, BalanceType, BaseOptions, GiftCardComponent, GiftCardOptions } from "../providers/definitions";
import { BaseComponentBuilder, DefaultComponent } from "./definitions"

export class FormBuilder extends BaseComponentBuilder {
  constructor(baseOptions: BaseOptions) {
    super(baseOptions);
  }

  build(config: GiftCardOptions): GiftCardComponent {
    return new FormComponent({
      giftcardOptions: config,
      sessionId: this.sessionId,
      processorUrl: this.processorUrl,
    })
  }
}

export class FormComponent extends DefaultComponent {
  constructor(opts: {
    giftcardOptions: GiftCardOptions;
    sessionId: string;
    processorUrl: string;
  }) {
    super(opts);
  }

  balance(): Promise<BalanceType> {
    // TODO: Implement call to /balance https://commercetools.atlassian.net/browse/SCC-2620
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