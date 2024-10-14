import { BaseOptions, WidgetOptions, GiftCardWidget, GiftCardWidgetBuilder } from "../giftcards/definitions";


/**
 * Base Web Component
 */
export abstract class BaseWidgetBuilder implements GiftCardWidgetBuilder {
  protected sessionId: string;
  protected processorUrl: string;

  constructor(baseOptions: BaseOptions) {
    this.sessionId = baseOptions.sessionId;
    this.processorUrl = baseOptions.processorUrl;
  }

  abstract build(config: WidgetOptions): GiftCardWidget;
}

export abstract class DefaultWidget implements GiftCardWidget {
  protected widgetOptions: WidgetOptions;
  protected sessionId: string;
  protected processorUrl: string;

  constructor(opts: {
    widgetOptions: WidgetOptions;
    sessionId: string;
    processorUrl: string;
  }) {
    this.widgetOptions = opts.widgetOptions;
    this.sessionId = opts.sessionId;
    this.processorUrl = opts.processorUrl;
  }
  abstract balance(): void;

  abstract submit(): void;

  abstract mount(selector: string): void ;
}
