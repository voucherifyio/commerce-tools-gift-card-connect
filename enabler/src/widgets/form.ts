import { BaseOptions, GiftCardWidget, WidgetOptions } from "../providers/definitions";
import { BaseWidgetBuilder, DefaultWidget } from "./definitions"

export class FormBuilder extends BaseWidgetBuilder {
  constructor(baseOptions: BaseOptions) {
    super(baseOptions);
  }

  build(config: WidgetOptions): GiftCardWidget {
    return new FormWidget({
      widgetOptions: config,
      sessionId: this.sessionId,
      processorUrl: this.processorUrl,
    })
  }
}

export class FormWidget extends DefaultWidget {
  constructor(opts: {
    widgetOptions: WidgetOptions;
    sessionId: string;
    processorUrl: string;
  }) {
    super(opts);
  }

  balance(): void {
    // TODO: Implement call to /balance https://commercetools.atlassian.net/browse/SCC-2620
    return null
  }

  submit(): void {
    // TODO: Implement call to /redeem https://commercetools.atlassian.net/browse/SCC-2621
    return null
  }

  mount(_: string): void {
    // TODO: Mount input field component here https://commercetools.atlassian.net/browse/SCC-2619
    return null
  }

  // TODO: implement a method that returns the form html element, call this method in the mount method.
}