import { BaseOptions, GiftCardOptions, GiftCardComponent, GiftCardBuilder, BalanceType, Amount } from "../providers/definitions";


/**
 * Base Web Component
 */
export abstract class BaseComponentBuilder implements GiftCardBuilder {
  protected sessionId: string;
  protected processorUrl: string;

  constructor(baseOptions: BaseOptions) {
    this.sessionId = baseOptions.sessionId;
    this.processorUrl = baseOptions.processorUrl;
  }

  abstract build(config: GiftCardOptions): GiftCardComponent;
}

export abstract class DefaultComponent implements GiftCardComponent {
  protected giftcardOptions: GiftCardOptions;
  protected sessionId: string;
  protected processorUrl: string;

  constructor(opts: {
    giftcardOptions: GiftCardOptions;
    sessionId: string;
    processorUrl: string;
  }) {
    this.giftcardOptions = opts.giftcardOptions;
    this.sessionId = opts.sessionId;
    this.processorUrl = opts.processorUrl;
  }
  abstract balance(): Promise<BalanceType>;

  abstract submit(opts: {amount?: Amount}): void;

  abstract mount(selector: string): void ;
}
