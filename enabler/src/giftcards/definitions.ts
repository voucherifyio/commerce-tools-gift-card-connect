export interface GiftCardWidget {
  submit(): void;
  balance(): void;
  mount(selector: string): void;
}

export interface GiftCardWidgetBuilder {
  build(config: WidgetOptions): GiftCardWidget;
}

export type WidgetOptions = {};

export type BaseOptions = {
  sessionId: string;
  processorUrl: string;
};

export type EnablerOptions = {
  processorUrl: string;
  sessionId: string;
  onComplete?: (result: PaymentResult) => void;
  onError?: (error: any) => void;
};

export type PaymentResult =
  | {
      isSuccess: true;
      paymentReference: string;
    }
  | { isSuccess: false };

export interface GiftCardEnabler {
  /**
   * @throws {Error}
   */
  createComponentBuilder: (
    type: string
  ) => Promise<GiftCardWidgetBuilder | never>;
}