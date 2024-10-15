import { Errorx, ErrorxAdditionalOpts } from '@commercetools/connect-payments-sdk';

export type VoucherifyApiErrorData = {
  status: number;
  errorCode: string;
  message: string;
  errorType?: string;
};

export class VoucherifyApiError extends Errorx {
  constructor(errorData: VoucherifyApiErrorData, additionalOpts?: ErrorxAdditionalOpts) {
    super({
      code: `VoucherifyError-${errorData.errorCode}`,
      httpErrorStatus: errorData.status,
      message: errorData.message,
      ...additionalOpts,
    });
  }
}
