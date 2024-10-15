import { FormBuilder } from "../widgets/form";
import { BaseOptions, EnablerOptions, GiftCardEnabler, GiftCardWidgetBuilder } from "./definitions";

export class VoucherifyEnabler implements GiftCardEnabler {
  setupData: Promise<{ baseOptions: BaseOptions }>;

  constructor(options: EnablerOptions) {
    this.setupData = VoucherifyEnabler._Setup(options);
  }

  private static _Setup = async (options: EnablerOptions): Promise<{ baseOptions: BaseOptions }> => {
    // HINT: config calls can be done here, to be used if necessary in the enabler

    return {
      baseOptions: {
        sessionId: options.sessionId,
        processorUrl: options.processorUrl,
      },
    };
  };

  async createComponentBuilder(): Promise<GiftCardWidgetBuilder | never> {
    const setupData = await this.setupData;
    if (!setupData) {
      throw new Error("VoucherifyEnabler not initialized");
    }
    
    
    return new FormBuilder(setupData.baseOptions);
  }
}
