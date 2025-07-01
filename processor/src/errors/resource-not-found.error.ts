import { VoucherifyCustomError } from './voucherify-api.error';

export class ResourceNotFoundVoucherifyCustomError extends VoucherifyCustomError {
  constructor(error: { code?: number; details?: string }) {
    super({
      code: error?.code || 404,
      key: 'NotFound',
      message: error?.details || 'Resource not found',
    });
  }
}
